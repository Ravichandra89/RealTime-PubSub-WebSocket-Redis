# WebSocket - Redis Queue - PUB/SUB

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

## Getting Started

### Prerequisites

- Node.js
- Redis

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/WebSocket_Redis_Pub_sub.git
