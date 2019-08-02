import sys

def chat_bot_query(query, username) :
	return "Sorry "+ username+", We are currently unavaliable. Please try after some time. Thank You for your patience."

# This is how you'll receive the queries from your NodeJS server
# Notice that sys.argv[1] refers to the 2nd argument of the list passed 
# into the spawn('python', ...) function in your NodeJS server code above
query = str(sys.argv[1])
username = str(sys.argv[2])

# response from the chat bot using NLP
response = chat_bot_query(query, username)

# return your processed text to the NodeJS server via stdout
print(response)
sys.stdout.flush()