import os
import requests
import re
from dotenv import load_dotenv

load_dotenv()

SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

# ---- CONFIG ----
QUERY = "marketing agencies"
CITY = "Miami"
STATE = "FL"
COUNTRY = "US"
MAX_RESULTS = 200
OUTPUT_FILE = "companies.js"


# ---- helpers ----
def extract_email(text):
    if not text:
        return None
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else None


def fetch_email(website):
    if not website:
        return None
    try:
        resp = requests.get(website, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        if resp.status_code == 200:
            return extract_email(resp.text)
    except:
        pass
    return None


# ---- scrape ----
def scrape():
    params = {
        "engine": "google_maps",
        "q": f"{QUERY} in {CITY}",
        "api_key": SERPAPI_API_KEY
    }

    response = requests.get("https://serpapi.com/search", params=params)
    data = response.json()

    places = data.get("local_results", [])[:MAX_RESULTS]

    companies = []

    for place in places:
        website = place.get("website")
        email = fetch_email(website)

        companies.append({
            "name": place.get("title"),
            "email": email,
            "phone": place.get("phone"),
            "address": place.get("address"),
            "city": CITY,
            "state": STATE,
            "country": COUNTRY,
            "website": website
        })

    return companies


# ---- save to JS ----
def save_to_js(companies):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("const companies = [\n")

        for c in companies:
            f.write("  {\n")
            f.write(f'    name: "{c["name"]}",\n')
            f.write(f'    email: "{c["email"]}",\n')
            f.write(f'    phone: "{c["phone"]}",\n')
            f.write(f'    address: "{c["address"]}",\n')
            f.write(f'    city: "{c["city"]}",\n')
            f.write(f'    state: "{c["state"]}",\n')
            f.write(f'    country: "{c["country"]}",\n')
            f.write(f'    website: "{c["website"]}"\n')
            f.write("  },\n")

        f.write("];\n")


# ---- run ----
if __name__ == "__main__":
    companies = scrape()
    save_to_js(companies)
    print(f"Saved {len(companies)} companies to {OUTPUT_FILE}")