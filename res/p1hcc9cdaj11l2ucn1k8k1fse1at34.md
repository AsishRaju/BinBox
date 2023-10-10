> **Project** **#1** **CMPE** **281** **SEC** **48**
>
> **Asish** **Raju** **Vachavaya** **-** **016943433**

**Website:**
[[https://binbox-app.asish.site/]{.underline}](https://binbox-app.asish.site/)
**Youtube:**
[[https://youtu.be/fRn0qmUeV80]{.underline}](https://youtu.be/fRn0qmUeV80)

**Introduction**

BinBox is a Dropbox alternative that leverages S3 file storage service
to provide users with a secure environment to store and access files
across the internet. It supports operations such as uploading,
downloading, updating, and deleting files and also provides an admin
panel for a master view of all users. BinBox is made on top of AWS
services, ensuring high reliability and availability with auto-scaling
in mind based on the concurrent usage of the app. The files uploaded on
BinBox are made available to users globally with the help of edge
location via AWS CloudFront; this makes accessing files faster,
enhancing user experience.

![](./4ulxjh2g.png){width="4.760416666666667in"
height="6.8125in"}**BinBox** **Architecture**

**AWS** **Infrastructure**
**Setup**![](./w3eys03q.png){width="7.125in"
height="3.1666666666666665in"}![](./vqqozr21.png){width="7.125in"
height="1.3020833333333333in"}![](./ydd0t45a.png){width="7.124998906386701in"
height="1.28125in"}

**AWS** **Cognito:**

AWS provides user management and authentication services. It allows
developers to easily add secure user sign-up, sign-in, and access
control to web and mobile applications. BinBox uses AWS SDK to
authenticate users from its client side using custom login/signup pages.
We define a user pool with appropriate user attributes required to
consider a user account.

**AWS** **DynamoDB:**

A No-SQL database offered by AWS, BinBox uses DynamoDB to maintain the
user's file submissions list. Create a BinBox table and set read and
write autoscaling to provisioned capacity.

Enable global tables for replicating DynamoDB table across the different
regions; here, the region of choice is ap-south-1 (Mumbai) while the
primary one is in us-east-2 (Ohio). This enables fault tolerance during
the unavailability of one region and can also be applied to failover
strategies.

![](./1l2bzc5p.png){width="7.708333333333333in"
height="1.8541666666666667in"}![](./sh5buglg.png){width="7.125in"
height="3.4479166666666665in"}

Each entry into the table has a pp-key (partition key) randomly
generated during insertion and used as a primary key to run queries on
the table.

**AWS** **S3:**

![](./23npj52f.png){width="7.125in" height="1.84375in"}S3 is an
object storage service provided by S3; this is where the actual files
are stored and uploaded by the user. To increase availability and
durability, the S3 primary bucket is replicated to cross region
ap-south-1 (Mumbai), and the replication is set to happen on each file
and folder.

![](./31ke1smi.png){width="7.125in"
height="1.5416666666666667in"}![](./g55dndo1.png){width="7.125in"
height="1.1354166666666667in"}

Enabling transfer acceleration reduces the upload speed by a significant
fold, as the continent is uploaded to the nearest edge server. Then, the
whole content travels to the origin of the S3 bucket.

![](./jw2hadcf.png){width="7.125in"
height="3.4479166666666665in"}Enabling a lifecycle policy can help
maintain objects\' lifecycle and transfer objects through different S3
access tiers. The current lifecycle policy is to transfer current
objects to S3-IA after 75 days of object creation and then move to
Glacier Instant Retrieval after 365 days; for the non-current versions,
the latest three versions of the objects are retained, and others are
deleted. The same lifecycle policy applies to the replication layer in
the ap-south-1 (Mumbai) S3 bucket.

**AWS** **Lambda:**![](./mkblwmgo.png){width="7.124998906386701in"
height="1.3020833333333333in"}

AWS Lambda is a serverless computing offering that allows users to run
their code without worrying about the underlying setup of infrastructure
required to do so. BinBox uses lambda to call backend APIs required to
access the DynamoDB items and S3 file uploading.

![](./bz21s2pb.png){width="7.125in"
height="2.7604166666666665in"}![](./ht3srzr0.png){width="7.125in"
height="2.78125in"}Defined two lambda functions here;
"binbox-presign-url" lambda to obtain a pre-sign URL required to upload
a file to S3 and "binbox-db-ops" to handle all the dynamoDb-related
functions required to make the update, read, create operation on the
table.

**API** **Gateway**![](./vakt2x15.png){width="7.124998906386701in"
height="2.1979166666666665in"}

API gateway offering provided by AWS to connect backend services such as
AWS lambda, EC2, and other database services to expose the services to a
frontend client. Here, API Gateways are attached to the lambda function
to provide client-facing endpoints required by the frontend to upload or
make database queries.

![](./uvblcvxo.png){width="7.125in"
height="2.1354166666666665in"}![](./uh0gj05h.png){width="4.65625in"
height="3.6041666666666665in"}This API acts as a trigger for AWS Lambda
functions to invoke and process data.

![](./ogm1svcu.png){width="7.125in" height="3.3645833333333335in"}

**AWS** **CloudFront**

![](./tcsbk4vb.png){width="7.124998906386701in"
height="2.0104166666666665in"}![](./3yi1sner.png){width="7.052083333333333in"
height="2.6666666666666665in"}Cloudfront is a content delivery network
service offered by AWS. It is intended to increase the performance,
scalability, and reliability of your online content, apps, and APIs by
caching and delivering them from a worldwide network of edge data
centers. CloudFront is frequently used to expedite static and dynamic
content delivery, minimize latency, and enhance overall user experience.
CloudFront here is enabled for lambda functions and S3, making lambda
functions run at edge with node.js runtime.

![](./5zrxvoyh.png){width="7.124998906386701in"
height="2.9583333333333335in"}![](./wcblzqq2.png){width="7.124998906386701in"
height="3.5in"}

**AWS** **EC2**

A compute service offered by AWS. It helps organizations and developers
to effortlessly install and operate virtual servers in the cloud, known
as instances. EC2 instances may be configured to handle a wide range of
workloads, from web apps and database hosting to machine learning models
and

high-performance computing activities. BinBox EC2 is set via an
autoscale group, for which we initiate a launch template.

This launch template is assigned to an autoscale group that works with a
combination of Cloudwatch to measure CPU usage, launch an instance in
the same region, and notify the user via an SNS topic attached to the
autoscale group.

![](./3cvtowpb.png){width="7.124998906386701in"
height="3.25in"}![](./2g22rfqn.png){width="7.125in"
height="3.2395833333333335in"}

The same is carried forward to the ap-south-1 (Mumbai) with the
autoscaling group and launch instance

Configure SNS topic so the author or administrator gets notified about
the activity on the auto-scaling group.

![](./at3j3nfq.png){width="7.125in"
height="3.2083333333333335in"}![](./enrnwmum.png){width="7.124998906386701in"
height="3.4895833333333335in"}

**Application** **Load** **Balancer**

An Application Load Balancer (ALB) is a fully managed load balancing
service provided by Amazon Web Services (AWS) as part of its Elastic
Load Balancing (ELB) offering. ALB is designed to distribute incoming
application traffic across multiple targets, such as Amazon EC2
instances, containers, Lambda functions, and IP addresses, based on the
content of the requests. It operates at the OSI model\'s application
layer (Layer 7), making it well-suited for handling modern web
applications. Here, the application load balancer is attached to the
auto-scaling group, which distributes load between the running instances
in the region.

The same is replicated to the us-east-2 (Ohio) region where an
application load balancer sits in front of the autoscaling group of the
ec2 instances in the Ohio region.

**Route** **53**![](./rumb0ac0.png){width="7.125in"
height="1.59375in"}

Route 53 is an offered domain name service provider; Route 53 enables
you to register domain names, route incoming traffic to AWS resources,
and perform domain management tasks like health checking, failover
routing, and traffic policy configuration. Creating a Hosted Zone
enables the author to manage his domain name from the given name
servers. BinBox uses a failover routing policy to shift between
available zones of computing. For the following, we enable health checks
for both regions.

![](./01ewatlm.png){width="7.125in"
height="3.2604166666666665in"}![](./orlpya45.png){width="2.5208333333333335in"
height="2.208332239720035in"}![](./pm5emca4.png){width="2.75in"
height="2.2916666666666665in"}When any one of the regions heals, checks
fail the Route53 failover. Redirects the user to the r-2 computing zone,
ensuring proper website availability.

**Application**
**Screenshots**![](./mq3a3pzo.png){width="7.6875in"
height="4.166666666666667in"}

**Login** **Page:**

![](./42jhclrk.png){width="7.677083333333333in"
height="3.8229166666666665in"}**Sign** **Up** **Page**

**OTP** **Verify**
**Page:**![](./1w5dmsie.png){width="7.124998906386701in"
height="2.6666666666666665in"}

![](./xusf5k5q.png){width="7.6875in"
height="3.1354166666666665in"}**User** **Home** **Page:**

Upload Screen![](./huivnq2c.png){width="7.124998906386701in"
height="2.9270833333333335in"}

![](./ghd1norb.png){width="7.124998906386701in"
height="3.5416666666666665in"}**Update** **File** **Screen**

![](./0bevyfoq.png){width="7.124998906386701in"
height="3.4479166666666665in"}**Admin** **Panel**
