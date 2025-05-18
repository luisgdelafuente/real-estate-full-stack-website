import requests
import json
import sys

def test_api_root():
    """Test the root API endpoint"""
    print("Testing /api/ endpoint...")
    
    # Get the backend URL from the frontend .env file
    backend_url = "https://9d185aaf-c3e8-425e-98f3-a01c221f8c98.preview.emergentagent.com"
    
    try:
        # Make a GET request to the API root
        response = requests.get(f"{backend_url}/api/")
        
        # Check if the request was successful
        if response.status_code == 200:
            print(f"✅ API root endpoint returned status code 200")
            
            # Parse the JSON response
            data = response.json()
            
            # Check if the response contains the expected message
            expected_message = "Bienvenido a la API de InmobiliariaZaragoza"
            if "message" in data and data["message"] == expected_message:
                print(f"✅ API root endpoint returned the expected message: '{expected_message}'")
                return True
            else:
                print(f"❌ API root endpoint did not return the expected message.")
                print(f"Expected: '{expected_message}'")
                print(f"Received: {data}")
                return False
        else:
            print(f"❌ API root endpoint returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing API root endpoint: {str(e)}")
        return False

if __name__ == "__main__":
    # Run the tests
    api_root_success = test_api_root()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"API Root Endpoint: {'✅ PASS' if api_root_success else '❌ FAIL'}")
    
    # Exit with appropriate status code
    sys.exit(0 if api_root_success else 1)