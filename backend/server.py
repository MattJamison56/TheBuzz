from flask import Flask, request, jsonify
from aisummarization import summarize
from newapi import getArticles
from flask_cors import CORS
import os
import psycopg2
from dotenv import load_dotenv
from passlib.hash import sha256_crypt

#SQL commands that will be run
CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT, password_hash TEXT, email TEXT);"
)

CREATE_INFO_TABLE = (
    "CREATE TABLE IF NOT EXISTS information (user_id INTEGER, search_history TEXT, favorites TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"
)

INSERT_USERS = (
    "INSERT INTO users (username, password_hash, email) VALUES (%s, %s, %s) RETURNING id;"
)

INSERT_INFO = (
    "INSERT INTO information (user_id, search_history) VALUES (%s, %s);"
)

INSERT_FAVORITE = (
    "INSERT INTO information (user_id, favorites) VALUES (%s, %s);"
)

#this one just for fun
USER_COUNT = ("""SELECT COUNT (DISTINCT username) AS user_count;""")

DELETE_FAVORITE = (
    "DELETE FROM information WHERE user_id = %s AND favorites = %s;"
)

DELETE_HISTORY = (
    "DELETE FROM information WHERE user_id = %s AND search_history = %s;"
)


load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

CORS(app, origins=["http://localhost:3000"])


@app.route('/')
def test():
    return {"test": ["1", "2", "3"]}

@app.route('/search', methods=["POST"])
def search():
    try:
        data = request.get_json()
        category = data.get('category')
        keyword = data.get('keyword')
        user_id = data.get('user_id')

        if category == "none":
            category = None
        
        if keyword == "none":
            keyword= None

        uncleanedarticles, uncleanedlinks = getArticles(keyword, category)

        if user_id != "":
            # Add to database
            with connection:
                with connection.cursor() as cursor:
                    # Create or skip creating da SQL table
                    cursor.execute(CREATE_INFO_TABLE)
                    
                    #insert into search history
                    if category == None:
                        category = ""
                    if keyword == None:
                        keyword = ""
                    word = category + keyword

                    cursor.execute(INSERT_INFO, (user_id, word))

        #Get rid of bad articles or youtube links
        articles = []
        links = []
        for i in range(len(uncleanedarticles)):
            if not("Request Error" in uncleanedarticles[i] or "youtube" in uncleanedlinks[i]):
                articles.append(uncleanedarticles[i])
                links.append(uncleanedlinks[i])

        summaries = [summarize(article) for article in articles]

        response_data = {
            'summaries': summaries,
            'links': links
        }
        
        return jsonify(response_data), 200

    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error in search route: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/register', methods=["POST"])
def register():
    if request.method=="POST":
        data = request.get_json()
        regusername = data.get('regusername')
        regemail = data.get('regemail')
        regpassword = data.get('regpassword')

        with connection:
            with connection.cursor() as cursor:
                # Create or skip creating da SQL table
                cursor.execute(CREATE_USERS_TABLE)

                # Check if username already exists
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE username = '{regusername}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == True:
                    return jsonify("Username already exists :(")

                # Check if email already has an account
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{regemail}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == True:
                    return jsonify("Email already exists :(")

                # Made it past checks

                # Hash the password
                hashed_password = sha256_crypt.hash(regpassword)

                # Store the Username, Hashed_Password, and Email
                cursor.execute(INSERT_USERS, (regusername, hashed_password, regemail))
                message = "Registration Successful!"

        return jsonify(message), 200
    
@app.route('/login', methods=["POST"])
def login():
    if request.method=="POST":
        data = request.get_json()
        loginemail = data.get('loginemail')
        loginpassword = data.get('loginpassword')

        hashed_password = sha256_crypt.hash(loginpassword)

        with connection:
            with connection.cursor() as cursor:
                # Check if email already exists
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{loginemail}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == False:
                    return jsonify("No User Found")

                # Check if password correct
                query = f"SELECT password_hash FROM users WHERE email = '{loginemail}';"
                cursor.execute(query)
                stored_password = cursor.fetchone()[0]
                passwordcorrect = sha256_crypt.verify(loginpassword, stored_password)
                if passwordcorrect == False:
                    return jsonify("Password Incorrect")
                query = f"SELECT id FROM users WHERE email = '{loginemail}';"
                cursor.execute(query)
                user_id = cursor.fetchone()[0]
                message = "Login successful!"

        response = {
            "user_ID": str(user_id),
            "message": message
        }

        print(response)

        return jsonify(response)  

@app.route('/searchhistory', methods=["POST"])
def searchhistory():
    if request.method=="POST":
        user_id = request.get_json().get('user_id')
        with connection:
            with connection.cursor() as cursor:
                # Check if email already exists
                query = f"SELECT search_history FROM information WHERE user_id = { user_id };"
                cursor.execute(query)
                searchhistories =  cursor.fetchall()
                response = [record[0] for record in searchhistories]

        return jsonify(response)

@app.route('/favorites', methods=["POST"])
def favorite():
    if request.method=="POST":
        user_id = request.get_json().get('user_id')
        with connection:
            with connection.cursor() as cursor:
                # Check if email already exists
                query = f"SELECT favorites FROM information WHERE user_id = { user_id };"
                cursor.execute(query)
                favorites =  cursor.fetchall()
                response = [record[0] for record in favorites]

        return jsonify(response)

@app.route('/addfavorite', methods=["POST"])
def addfavorite():
    if request.method=="POST":
        data = request.get_json()
        word = data.get('word')
        user_id = data.get('user_id')
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(CREATE_INFO_TABLE)
                cursor.execute(INSERT_FAVORITE, (user_id, word))
                
        return jsonify('Added!')

@app.route('/deletefav', methods=["POST"])
def removefavorite():
    if request.method=="POST":
        data = request.get_json()
        item = data.get('item')
        user_id = data.get('user_id')
        if user_id != "":
            with connection:
                with connection.cursor() as cursor:
                    cursor.execute(DELETE_FAVORITE, (user_id, item))
        return jsonify('Deleted!')
                    
@app.route('/deletehist', methods=["POST"])
def removehistory():
    if request.method=="POST":
        data = request.get_json()
        item = data.get('item')
        user_id = data.get('user_id')
        if user_id != "":
            with connection:
                with connection.cursor() as cursor:
                    cursor.execute(DELETE_HISTORY, (user_id, item))
        return jsonify('Deleted!')


# Running app
if __name__ == '__main__':
	app.run(debug=True)
