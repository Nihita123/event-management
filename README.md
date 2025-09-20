# NextUp - Client Event Management Platform 

**Tech Stack:** MongoDB, Express, React, Node.js, Tailwind CSS, shadcn/ui

A **scalable, role-based web application** that empowers event organizers to create, monitor, and manage events efficiently, while providing attendees a seamless experience. Developed as part of the **Microsoft CWB Hackathon** (2nd place winner).

---

## Key Features & Achievements

- **Role-Based Access Control:**  
  The platform supports secure login and authentication using OAuth 2.0 and JWT-based session management. This ensures that organizers, attendees, and other roles have strictly controlled access to their respective dashboards and functionalities, maintaining data privacy and security throughout the application.

- **Engaging and Interactive Frontend:**  
  Built with React, Tailwind CSS, and shadcn/ui, the frontend delivers a smooth and intuitive user experience. Thoughtful layout design, interactive components, and responsive elements guide users effortlessly through event creation, guest management, and event participation, improving overall engagement and satisfaction.

- **Real-Time Event Management:**  
  Organizers can efficiently manage events with dynamic guest approval flows, instant toast notifications using `react-hot-toast`, and live updates. This creates a seamless and interactive experience for both organizers and attendees, reducing manual coordination effort and improving workflow speed.

- **Scalable and Robust Architecture:**  
  Designed with scalability in mind, the application efficiently handles multiple concurrent users and events. The backend built with Express and MongoDB ensures reliable data storage, retrieval, and smooth performance, making it suitable for a growing user base.

- **Enhanced User Experience and Productivity:**  
  Features like guest approval, event monitoring, and feedback notifications enable organizers to focus on strategic event management rather than manual tasks. Attendees benefit from a clear, easy-to-navigate interface, helping them quickly access event details, confirm attendance, and receive updates in real-time.

---

## Project Impact

This platform streamlines event operations, allowing organizers to **manage guests, track attendance, and oversee event logistics** with real-time feedback, improving both efficiency and user satisfaction.

---

## Demo

Check out a **live demo video** of the application in action:  
[Watch Demo Video](https://youtu.be/bO2avKzJPGM)


---

## Installation

```bash
# Clone the repository
git clone https://github.com/Nihita123/event-management.git
cd event-management

# Install backend dependencies
cd backend
npm install
npm start

# Install frontend dependencies
cd ../frontend
npm install
npm run dev
