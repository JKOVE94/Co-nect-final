import mysql.connector
from .config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

def connect_to_db():
    try:
        mydb = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8',
            collation='utf8mb4_general_ci'
        )
        return mydb
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None