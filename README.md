# AWS Serverless Image Converter

This pr

## Instructions:
To run this project locally:
Clone this project to your local machine
### `git clone https://github.com/sufka861/Thumbnail-converter.git`
Run the project with:
### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

This App is also deployed on AWS S3 and available via AWS CloudFront at the following address in your browser:
[https://g8.shenkar.demo-cloud.com/](https://g8.shenkar.demo-cloud.com/)

**Inside the browser app:**
You can select to upload a photo from your image gallery
Or Take a photo from your devices camera.

In both you can select one or more sizes which you would like to get your image thumbnail in.
After uploading the image you may select the sizes and submit.
If you choose your divices camera, first select the wanted sizes and then take the photo it will submit automatically.

You will get back as much URLs as you picked in the sizes.
Each URL is a thumbnail you may view and download.
Enjoy!

**Tools**
FrontEnd : React JS code stored in AWS S3 Bucket.
Client Browser recieves code through AWS CloudFront
BackEnd : AWS Serverless -> Lambda functions. Access to S3 Buckets with Pre-Signed URLs.
Logs : AWS CloudWatch
Security : AWS IAM



