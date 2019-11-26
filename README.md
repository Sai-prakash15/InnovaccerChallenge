# Innovaccer SDE Intern Challenge #

By Sai Prakash Chittampalli

## The Challenge ##

Design an entry management system which will notify the visitors and the hosts of successful check-outs and check-ins.

## Run Instructions ##

To ease deployment, I have utilized Docker for the project. Follow these steps if you have Docker installed (might require `sudo` in Linux systems): 

1. `docker-compose run --rm start_deps`
2. Wait for the above command to start the message broker and the redis instance.
3. `docker-compose up`
4. Visit `localhost:3000/` to interact with the application.
5. You might have to click twice on the email button, to force the update to happen.

## The Approach ##

I have not implemented the SMS notification functionality as the providers for such services require billing details, etc.

I identified that the task of storing the meeting details could be separated from the task of actually sending the notification emails. Thus, I adopted a service-based approach where I divided the project into three services:

- Backend: To serve the API which will allow interaction with the system.
- Worker: An application whose sole concern is to send the notifications.
- Client: A simply frontend made in EJS to exhibit the functionality of the project.

By opting for an API-oriented approach, I could effectively work on the logic side and the presentation side separately as long as I adhered to the contract of the API. This gives me the flexibility to choose a different frontend, such as React, if I wish to do so. The API-first approach I adopted lends me the freedom to utilize the functionality I created in different scenarios.

The backend is in-charge of taking the details of the meeting and storing them in the database. Meanwhile, it also pushes a message onto the notification queue. The worker listens to the notification queue and it is the one responsible for sending the emails. This approach allows the flexbility to implement the SMS part at a later stage by simply adding code to the worker, without touching the backend in any way.

I utilized Redis as the database, primarily because I wanted to quickly get the app running. RabbitMQ was the message broker of my choice.

Client --- Send details ---> Backend ---> Store in DB and push to queue.
Worker --- Takes messages from queue ---> Sends emails.

## The Future ##

There are some things I could have done differently:

- Go with a full-fledged, data storage database like MongoDB.
- AWS provides services such as SNS which simply the whole notification process.
- More robust error handling.
