import requests
import os
import time
from urllib.parse import urlparse
from pathlib import Path
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://stage.cprxholdings.com/wp-json/wp/v2/media"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "wp-media"
PER_PAGE = 100

AUTH = ("vineeth_staging", "admin")
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def get_session():
    s = requests.Session()
    s.auth = AUTH
    s.headers.update(HEADERS)
    retry = Retry(total=5, backoff_factor=2, status_forcelist=[429, 500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    s.mount("https://", adapter)
    s.mount("http://", adapter)
    return s

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    session = get_session()

    page = 1
    total = None
    total_pages = None
    downloaded = 0
    skipped = 0
    errors = 0

    print(f"Downloading images from {BASE_URL}")
    print(f"Saving to {OUTPUT_DIR}\n")

    while True:
        try:
            resp = session.get(
                BASE_URL,
                params={"per_page": PER_PAGE, "page": page, "media_type": "image"},
                timeout=60,
            )
        except requests.exceptions.ConnectionError as e:
            print(f"  Connection error on page {page}, waiting 30s and retrying...")
            time.sleep(30)
            try:
                resp = session.get(
                    BASE_URL,
                    params={"per_page": PER_PAGE, "page": page, "media_type": "image"},
                    timeout=60,
                )
            except Exception:
                print(f"  Still failing. Stopping at page {page}.")
                break

        if resp.status_code == 400:
            break
        resp.raise_for_status()

        if total is None:
            total = int(resp.headers.get("X-WP-Total", 0))
            total_pages = int(resp.headers.get("X-WP-TotalPages", 0))
            print(f"Total image items: {total} ({total_pages} pages)\n")

        items = resp.json()
        if not items:
            break

        print(f"--- Page {page}/{total_pages} ({len(items)} items) ---")

        for item in items:
            source_url = item.get("source_url", "")
            item_id = item.get("id", 0)

            filename = os.path.basename(urlparse(source_url).path)
            if not filename:
                filename = f"{item_id}.jpg"

            dest = OUTPUT_DIR / filename
            if dest.exists():
                skipped += 1
                continue

            try:
                r = session.get(source_url, stream=True, timeout=60)
                r.raise_for_status()
                with open(dest, "wb") as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
                downloaded += 1
                if downloaded % 50 == 0:
                    print(f"  Downloaded {downloaded} so far...")
            except Exception as e:
                print(f"  ERROR: {filename} - {e}")
                errors += 1

        print(f"  Page {page} done. Downloaded: {downloaded}, Skipped: {skipped}")
        page += 1
        if total_pages and page > total_pages:
            break

        time.sleep(1)

    print(f"\nDone! Downloaded: {downloaded}, Skipped (existed): {skipped}, Errors: {errors}")

if __name__ == "__main__":
    main()
