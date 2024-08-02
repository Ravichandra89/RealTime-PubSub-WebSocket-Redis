# WebSocket - Redis Queue - PUB/SUB & Backend Communication

## Overview

This project demonstrates how to scale WebSocket connections using Redis Pub/Sub and efficient sticky connections. The WebSocket server is designed to handle multiple users and route them based on their room IDs or geographic locations to maintain efficient communication.

## Features

- **Basic Scaling**: Users are routed to WebSocket servers based on room IDs.
- **Sticky Connections**: Users are grouped by their country locations.
- **Inter-Server Communication**: WebSocket servers communicate with each other using Redis Pub/Sub.

## WebSocket Scaling

![WebSocket Scaling](https://github.com/user-attachments/assets/0bc24d15-73fc-451c-bfe8-a2ad99947c93)

### Basic Scaling

In basic scaling, users are routed to the WebSocket server based on the same room ID. This ensures that all users in a particular room are connected to the same server, minimizing latency and improving the real-time communication experience.

### Efficient Sticky Connections

Efficient sticky connections involve grouping users by their geographic locations. This approach ensures that users from the same country or region are connected to the same WebSocket server, further reducing latency and optimizing server resources.

### Inter-Server Communication

To handle communication between different WebSocket servers, we use Redis Pub/Sub. This allows servers to publish and subscribe to messages, ensuring that messages can be broadcasted to all relevant users, even if they are connected to different servers.

## LeetCode Architecture of Submissions 

### 1. Redis Queue Problem submission Architecture

<img width="1710" alt="Screenshot 2024-08-02 at 8 21 03 PM" src="https://github.com/user-attachments/assets/0d7f04c9-4a3c-4ef5-adf2-39f171b0983f">

### 2. Web Scoket for Status Sending with persistent Connection

<img width="1710" alt="Screenshot 2024-08-02 at 8 25 08 PM" src="https://github.com/user-attachments/assets/f5dfb866-10e9-4d3e-a5ef-4cded49a2d87">

### WebSocket + Redis Queue LeetCode Complete problem Submission Architecture

<img width="1710" alt="Screenshot 2024-08-02 at 8 32 54 PM" src="https://github.com/user-attachments/assets/12f1bd2c-b4f1-4357-96f0-7dc5d2a753a1">


   
