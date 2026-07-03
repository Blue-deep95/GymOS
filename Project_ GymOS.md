

# **Project: GymOS**

**A complete operations platform for a single gym.**

---

# **Roles**

* Owner  
* Receptionist (Checks members in, manages member details, assigns/renews memberships, and assigns trainers to members)  
* Trainer  
* Member

Simple RBAC with different dashboards.

---

# **Core Modules**

## **1\. Member Management**

Store member details

* Personal information  
* Emergency contact  
* Medical notes  
* Fitness goals  
* Current membership  
* Assigned trainer

Member states:

Active  
Expired  
Frozen  
Inactive

---

## **2\. Membership Management**

Plans:

* Monthly  
* Quarterly  
* Half-Yearly  
* Yearly

Track

* Start date  
* End date  
* Freeze period  
* Renewal history

Dashboard should highlight

* Expiring this week  
* Expired members  
* New members this month

No payment processing—just membership status and history.

---

## **3\. Attendance**

Receptionist checks members in.

Store

Member  
Date  
Time

Prevent duplicate check-ins on the same day.

Useful reports:

* Today's attendance  
* Weekly attendance  
* Monthly attendance  
* Most active members  
* Members absent for 30+ days

This gives you nice aggregation queries without unnecessary complexity.

---

## **4\. Trainer Management**

Store

* Specialization  
* Experience  
* Availability

Assign members.

Trainer dashboard shows

* My members  
* Today's sessions  
* Members needing progress updates

---

## **5\. Workout Planner**

Trainer creates reusable templates.

Example

Push Pull Legs  
Upper Lower  
Fat Loss  
Strength

Assign templates to members.

Members can view

* Current program  
* Weekly schedule  
* Exercise details

Support versioning so updating a template doesn't change programs already assigned to members.

---

## **6\. Progress Tracking**

Members don't just have attendance—they have measurable progress.

Track periodically:

* Weight  
* Body fat %  
* Chest  
* Waist  
* Arms  
* Thighs

Every measurement becomes a historical record.

Trainer can compare

Start

↓

Month 1

↓

Month 2

↓

Month 6

This is another good use of aggregation and historical data.

---

## **7\. Dashboard**

Keep it simple but useful.

Owner dashboard

* Active members  
* Expired memberships  
* Today's attendance  
* New members this month  
* Trainer workload  
* Attendance trend (last 30 days)

Trainer dashboard

* Assigned members  
* Members due for progress updates  
* Recent attendance

Reception dashboard

* Today's check-ins  
* Expiring memberships  
* Quick member search  
* Assign / update memberships for members  
* Assign trainers to members

---

## **8\. Reports**

Generate reports such as:

* Attendance report  
* Membership report  
* Trainer assignment report  
* Member progress report

Allow filtering by

* Date range  
* Trainer  
* Membership plan

This demonstrates more advanced querying than basic CRUD.

---

# **Tech Stack**

* React \+ Material UI  
* Redux Toolkit / RTK Query  
* Node.js \+ Express  
* MongoDB  
* JWT Authentication  
* Role-Based Access Control

---

