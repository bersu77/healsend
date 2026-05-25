import requests

r = requests.get(
    "https://stage.cprxholdings.com/wp-json/wp/v2/media",
    params={"per_page": 1, "page": 1},
    auth=("vineeth_staging", "admin"),
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
)
print("Status:", r.status_code)
print("Total media items:", r.headers.get("X-WP-Total", "unknown"))
print("Total pages:", r.headers.get("X-WP-TotalPages", "unknown"))
