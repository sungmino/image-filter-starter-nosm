#### Repo
- https://github.com/sungmino/image-filter-starter-nosm
#### API:
- Login: image-filter-starter-nosm-dev2.us-east-1.elasticbeanstalk.com/login
    + Method: POST
    + Body:
    ````
        {
        "username": "test1",
        "password": 123123
        }
    ````
- Register: image-filter-starter-nosm-dev2.us-east-1.elasticbeanstalk.com/signup
    + Method: POST
    + Body:
    ````
        {
        "username": "test1",
        "password": 123123
        }
    ````
- Get image:
    ````
    image-filter-starter-nosm-dev2.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://i.pinimg.com/736x/71/fe/83/71fe83b3f2423bb24a925ff72565fd0e.jpg

    ````