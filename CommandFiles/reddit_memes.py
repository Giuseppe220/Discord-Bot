from reddit_memes_to_urls import reddit_json_to_urls
import random
#gains access to the random module
​
def reddit_memes_list(argument):
    #Showing a list of ordered values (memes)
    memes = reddit_json_to_urls(argument)
    randomNumber = random.randint(0, len(memes))
    return str(randomNumber)+" "+memes[randomNumber]
    #A selected meme is chosen to represent.
​
​
reddit_memes_list("memes")
