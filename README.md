# Citibike Data Cruncher

## Purpose
This program will consume [Citibike trip
data](https://s3.amazonaws.com/tripdata/index.html) and create a friendly CSV
showing trips (start or end) in each month of the dataset.

## How to use it
1. Clone the repo
1. `npm install`
1. Replace the station ids in the script with the ones you're interested in
  1. You can find them [here](https://citibikenyc.com/explore)
1. Dowload the months you're interested in from
   [here](https://s3.amazonaws.com/tripdata/index.html), unzip them, and put
   the csvs in the `data` directory.
1. `node runner.js`
  1. This will take anywhere from a few minutes to an hour depending on how
     fast your computer is and how many files you're crunching. It can be a lot
     of data.
1. Find the results in `output.csv` file

## Example results
Results will look something like
[this](https://docs.google.com/spreadsheets/d/1YH3ImZapRiNjHsyH9Z9gYBgX-SjKiYH3J5jBSKr1JgY).
