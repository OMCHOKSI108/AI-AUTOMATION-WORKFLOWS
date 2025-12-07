import os
from openai import OpenAI

def main():
    # Load API Key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("❌ ERROR: OPENAI_API_KEY environment variable not set.")
        return

    client = OpenAI(api_key=api_key)

    # ==== TEST 1: Simple Chat Request ====
    print("\n=== Testing API Key ===")
    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input="Hello from Python! Is my API key working?"
        )
        print("✔️ API Key Working!")
        print("Response:", response.output_text)
    except Exception as e:
        print("❌ API Error:", e)
        return

    # ==== TEST 2: List Available Models ====
    print("\n=== Fetching Available Models ===")
    try:
        models = client.models.list()
        for m in models.data:
            print("→", m.id)
    except Exception as e:
        print("❌ Could not fetch models:", e)

if __name__ == "__main__":
    main()
