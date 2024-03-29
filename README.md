# Master Thesis - Performance Analysis of Serverless Design Patterns based on AWS Lambda

# Table of Contents

1. [Introduction](#introduction)
2. [Computing](#computing)

## Introduction

This repo is master thesis project about serverless desgin patterns carried out at Poznan University of Technology in the speclialisation Distributed and Cloud Systems.

## Computing

Each serverless pattern will be solving same problem - compute some of metrics based on the huge dataset. In master thesis I've used Kaggle Movie Dataset, which includes around 26 million ratings from 270 000 users for 45 000 movies. Source [here](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset). Each record has some properties:

- movieId
- userId
- rating (scale 0-5)
- timestamp.
  Huge dataset was divided by 10 subset files and parsed to JSON format. This files could represent variety of movie services like Filmweb, IMDb etc. Business logic is responsible for compute some metrics. This includes:
- Ranking of most famous movies (movies sorted by number of given ratings).
- Ranking of most active users.
- Rankig of best rated movies
- Ranking of best rated movies but by most frequently rated
- Movies with the highest amount of the best (greater than 4.0) rate and the worst rate (less than 3.0).
