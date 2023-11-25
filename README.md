<p align="center">
  <img alt="Flood Tracker" src="./assets/circular_banner_cropped.png" width="300" />
</p>

<h1 align="center">
  Flood Tracker
</h1>

<p align="center">
  An interactive web app for flood tracking and analysis, built with the MERN Stack, and employing machine learning and computer vision to provide environmental insights and damage assessments.
</p>

<p align="center">
  <a href="https://flood-tracker.onrender.com/">
    <img alt="Deploy Status: Up" src="https://img.shields.io/badge/status-up-navy">
  </a>
</p>
<!-- Flood Tracker is a full-stack application designed to monitor and analyze flood data in real-time. Utilizing the power of the MERN stack, along with the Google Earth Engine API, this application processes satellite images to extract vital statistics about flood-affected areas. It offers insights into the impact on urban areas, farmlands, and road networks -->

## Basic Overview

Flood Tracker was born out of a pressing need to address the escalating challenges posed by climate change, particularly in the realm of natural disasters such as floods. As extreme weather events become more frequent and severe, it is essential to have robust and reliable solutions for tracking and understanding flood situations. This application aims to meet that demand by leveraging cutting-edge technology to provide accurate, timely data that can aid in effective disaster management and mitigation efforts.

The application operates by integrating the Earth Engine API to fetch satellite data, which is then processed using a custom flood detection algorithm. It also employs machine learning to classify land covers, helping to estimate the impact of floods on different land types, such as agricultural areas, urban regions, and roadways. The frontend, developed using React, presents this data in an interactive, user-friendly dashboard, making it an invaluable tool for disaster management and response teams.

<!-- perhaps add a link to 'learn more' -->

### Features

- 🌍 **Satellite Flood Tracking**: Monthly updates using satellite data.
- 🌱 **ML Land Classification**: Identifies affected agricultural, urban, and road areas.
- 🗺️ **Interactive Maps**: Google Maps integration for data visualization.
- 📊 **React Dashboard**: User-friendly interface for intuitive data display.
- 🔒 **Secure Access Admin Panel**: Control panel for API and data management, protected with JWT authentication.
- 🎨 **Sleek UI**: Styled with Tailwind CSS and Material UI.

## How It Works

This section provides a high-level overview of the application's workflow. It is designed to give you a clear understanding of how the various components of the application interact with each other, from initial client requests to data processing and visualization. The Earth Engine processing pipeline will be discussed separately from the Client-Server Interaction.

### Client-Server Interaction:

The core of the application is the interaction between the client and the server. Below is a flowchart that illustrates this process.

<p align="center">
  <img alt="Application Flowchart" src="./assets/application-flowchart.png" width="100%" />
</p>

The client initiates the process by making a request over HTTP to the server. Depending on the nature of the request, the server either retrieves pre-processed data from the database or, if required, makes a call to the Earth Engine API to fetch or update the data. This could be triggered by the client or by a scheduled task, such as a monthly cron job. For operations that require real-time data, such as acquiring flood pixel map IDs, the server acts as an intermediary to ensure data security and integrity. It's important to note that administrative tasks, such as data management, are secured through JWT authentication, allowing only authorized admin users to access these features.

### Earth Engine Processing Pipeline

As previously mentioned, the Earth Engine API plays a crucial role in data processing. Let's explore this in the following flowchart.

<p align="center">
  <img alt="Earth Engine Processing Pipeline Flowchart" src="./assets/EE-api-pipeline-flowchart.png" width="100%" />
</p>

The Earth Engine processing pipeline involves several steps, starting from satellite imagery acquisition to the application of flood detection and land cover classification algorithms. This robust processing allows the application to generate detailed statistical data and visualization layers, such as flood extent maps, which are then made available to the client.

<br/>

This overview outlines the fundamental operations of the application. While it captures the essence of the app's functionality, each component is built on complex and sophisticated technology designed to provide reliable and timely flood data. For a more detailed understanding of each process, please refer to the detailed documentation sections.
