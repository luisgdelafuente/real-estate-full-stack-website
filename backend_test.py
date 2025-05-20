import requests
import json
import sys
from datetime import datetime

class RealEstateAPITester:
    def __init__(self, base_url="https://2a6a5997-4b69-45db-944d-259024b9ca70.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_resources = {
            "categories": [],
            "posts": [],
            "properties": []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        if data and not files and method != 'POST':
            headers['Content-Type'] = 'application/json'
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, headers=headers)
                elif endpoint == 'api/token':
                    # Special handling for token endpoint (form data)
                    response = requests.post(url, data=data)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.text else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )
        
        if success and "message" in response:
            expected_message = "Bienvenido a la API de InmobiliariaZaragoza"
            if response["message"] == expected_message:
                print(f"✅ API returned correct welcome message: '{expected_message}'")
                return True
            else:
                print(f"❌ API returned incorrect message: {response['message']}")
                return False
        return success

    def test_admin_login(self, email, password):
        """Test admin login and get token"""
        form_data = {
            "username": email,
            "password": password
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/token",
            200,
            data=form_data
        )
        
        if success and "access_token" in response:
            self.token = response["access_token"]
            print(f"✅ Successfully logged in as admin")
            return True
        
        print(f"❌ Failed to login as admin")
        return False

    def test_get_dashboard_stats(self):
        """Test getting dashboard statistics"""
        success, response = self.run_test(
            "Dashboard Statistics",
            "GET",
            "api/stats/dashboard",
            200
        )
        
        if success:
            # Check if response contains expected fields
            expected_fields = [
                "activeProperties", "totalProperties", "soldProperties", 
                "reservedProperties", "inactiveProperties", "totalPosts", 
                "publishedPosts", "draftPosts", "totalUsers", "totalCategories"
            ]
            
            missing_fields = [field for field in expected_fields if field not in response]
            
            if not missing_fields:
                print(f"✅ Dashboard stats contain all expected fields")
                return True
            else:
                print(f"❌ Dashboard stats missing fields: {', '.join(missing_fields)}")
                return False
        
        return False

    def test_get_categories(self):
        """Test getting all categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "api/categories",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Successfully retrieved {len(response)} categories")
            return True
        
        return False

    def test_create_category(self, name):
        """Test creating a new category"""
        success, response = self.run_test(
            "Create Category",
            "POST",
            "api/categories",
            200,
            data={"name": name}
        )
        
        if success and "id" in response:
            self.created_resources["categories"].append(response["id"])
            print(f"✅ Successfully created category: {name}")
            return response
        
        return None

    def test_get_posts(self):
        """Test getting all blog posts"""
        success, response = self.run_test(
            "Get Blog Posts",
            "GET",
            "api/posts",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Successfully retrieved {len(response)} blog posts")
            return True
        
        return False

    def test_create_post(self, title, content, excerpt=None, published=True, category_ids=None):
        """Test creating a new blog post"""
        data = {
            "title": title,
            "content": content,
            "published": published,
            "categoryIds": category_ids or []
        }
        
        if excerpt:
            data["excerpt"] = excerpt
        
        success, response = self.run_test(
            "Create Blog Post",
            "POST",
            "api/posts",
            200,
            data=data
        )
        
        if success and "id" in response:
            self.created_resources["posts"].append(response["id"])
            print(f"✅ Successfully created blog post: {title}")
            return response
        
        return None

    def test_update_post(self, post_id, title=None, content=None, published=None):
        """Test updating a blog post"""
        data = {}
        if title is not None:
            data["title"] = title
        if content is not None:
            data["content"] = content
        if published is not None:
            data["published"] = published
        
        success, response = self.run_test(
            "Update Blog Post",
            "PUT",
            f"api/posts/{post_id}",
            200,
            data=data
        )
        
        if success and "id" in response:
            print(f"✅ Successfully updated blog post")
            return True
        
        return False

    def test_get_properties(self):
        """Test getting all properties"""
        success, response = self.run_test(
            "Get Properties",
            "GET",
            "api/properties",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Successfully retrieved {len(response)} properties")
            return True
        
        return False

    def test_create_property(self, property_data):
        """Test creating a new property"""
        success, response = self.run_test(
            "Create Property",
            "POST",
            "api/properties",
            200,
            data=property_data
        )
        
        if success and "id" in response:
            self.created_resources["properties"].append(response["id"])
            print(f"✅ Successfully created property: {property_data['title']}")
            return response
        
        return None

    def cleanup(self):
        """Clean up created resources"""
        print("\n🧹 Cleaning up created resources...")
        
        # Delete created posts
        for post_id in self.created_resources["posts"]:
            self.run_test(
                f"Delete Post {post_id}",
                "DELETE",
                f"api/posts/{post_id}",
                200
            )
        
        # Delete created properties
        for property_id in self.created_resources["properties"]:
            self.run_test(
                f"Delete Property {property_id}",
                "DELETE",
                f"api/properties/{property_id}",
                200
            )
        
        # Delete created categories
        for category_id in self.created_resources["categories"]:
            self.run_test(
                f"Delete Category {category_id}",
                "DELETE",
                f"api/categories/{category_id}",
                200
            )

def main():
    # Setup
    tester = RealEstateAPITester()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    
    # Test API root
    api_root_success = tester.test_api_root()
    
    # Test admin login
    login_success = tester.test_admin_login("admin@inmobiliariazaragoza.com", "adminpassword")
    if not login_success:
        print("❌ Admin login failed, stopping tests")
        return 1
    
    # Test dashboard stats
    dashboard_success = tester.test_get_dashboard_stats()
    
    # Test categories
    categories_success = tester.test_get_categories()
    category = tester.test_create_category(f"Test Category {timestamp}")
    
    # Test blog posts
    posts_success = tester.test_get_posts()
    post = tester.test_create_post(
        f"Test Blog Post {timestamp}",
        "This is a test blog post content with detailed information.",
        "This is a test excerpt",
        True,
        [category["id"]] if category else []
    )
    
    post_update_success = False
    if post:
        post_update_success = tester.test_update_post(
            post["id"],
            f"Updated Test Blog Post {timestamp}",
            "Updated content for testing purposes."
        )
    
    # Test properties
    properties_success = tester.test_get_properties()
    property_data = {
        "title": f"Test Property {timestamp}",
        "description": "This is a test property description",
        "price": 250000,
        "location": "Zaragoza Centro",
        "address": "Calle Test 123",
        "zipCode": "50001",
        "city": "Zaragoza",
        "province": "Zaragoza",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 120,
        "yearBuilt": 2010,
        "energyRating": "B",
        "propertyType": "APARTMENT",
        "featured": True
    }
    property_created = tester.test_create_property(property_data)
    
    # Clean up created resources
    tester.cleanup()
    
    # Print results
    print("\n📊 Test Results Summary")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run) * 100:.2f}%")
    
    print("\n🔍 Feature Test Results:")
    print(f"API Root: {'✅ PASS' if api_root_success else '❌ FAIL'}")
    print(f"Admin Login: {'✅ PASS' if login_success else '❌ FAIL'}")
    print(f"Dashboard Stats: {'✅ PASS' if dashboard_success else '❌ FAIL'}")
    print(f"Categories List: {'✅ PASS' if categories_success else '❌ FAIL'}")
    print(f"Category Creation: {'✅ PASS' if category else '❌ FAIL'}")
    print(f"Blog Posts List: {'✅ PASS' if posts_success else '❌ FAIL'}")
    print(f"Blog Post Creation: {'✅ PASS' if post else '❌ FAIL'}")
    print(f"Blog Post Update: {'✅ PASS' if post_update_success else '❌ FAIL'}")
    print(f"Properties List: {'✅ PASS' if properties_success else '❌ FAIL'}")
    print(f"Property Creation: {'✅ PASS' if property_created else '❌ FAIL'}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())