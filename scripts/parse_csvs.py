import csv, json, sys

def parse_csv(path):
    products = []
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get('Name','').strip()
            typ = row.get('Type','').strip()
            if name and typ in ('variable','simple'):
                tiers_raw = row.get('Meta: _hld_subscription_tiers','').strip()
                tiers = []
                if tiers_raw:
                    try:
                        tiers = json.loads(tiers_raw)
                    except:
                        pass
                images = row.get('Images','').strip()
                desc = row.get('Short description','').strip()
                cat = row.get('Categories','').strip()
                wcid = row.get('ID','').strip()
                stripe_id = row.get('Meta: stripe_product_id','').strip()
                products.append({
                    'wcId': int(wcid) if wcid else None,
                    'name': name,
                    'type': typ,
                    'category': cat,
                    'description': desc,
                    'images': images,
                    'tiers': tiers,
                    'stripeProductId': stripe_id,
                })
    return products

p1 = parse_csv('wc-product-1.csv')
p2 = parse_csv('wc-product-2.csv')
all_products = p1 + p2
print(json.dumps(all_products, indent=2))
