-- Insert one random row of air quality data
-- Useful for testing the dashboard

INSERT INTO air_quality (
  temperature,
  humidity,
  co2,
  pm1_0,
  pm2_5,
  pm10,
  carbon_monoxide,
  voc
) VALUES (
  -- Temperature: Random between 15°C and 30°C
  ROUND((RANDOM() * 15 + 15)::numeric, 2),
  
  -- Humidity: Random between 20% and 80%
  ROUND((RANDOM() * 60 + 20)::numeric, 2),
  
  -- CO2: Random between 300 ppm and 2000 ppm
  ROUND((RANDOM() * 1700 + 300)::numeric, 2),
  
  -- PM1.0: Random between 5 µg/m³ and 50 µg/m³
  ROUND((RANDOM() * 45 + 5)::numeric, 2),
  
  -- PM2.5: Random between 5 µg/m³ and 60 µg/m³
  ROUND((RANDOM() * 55 + 5)::numeric, 2),
  
  -- PM10: Random between 10 µg/m³ and 100 µg/m³
  ROUND((RANDOM() * 90 + 10)::numeric, 2),
  
  -- Carbon Monoxide: Random between 0.5 ppm and 10 ppm
  ROUND((RANDOM() * 9.5 + 0.5)::numeric, 2),
  
  -- VOC: Random between 50 ppb and 500 ppb
  ROUND((RANDOM() * 450 + 50)::numeric, 2)
);

-- Alternative: Generate multiple random rows at once
-- Uncomment the query below to insert 10 random rows

/*
INSERT INTO air_quality (
  temperature,
  humidity,
  co2,
  pm1_0,
  pm2_5,
  pm10,
  carbon_monoxide,
  voc
)
SELECT 
  ROUND((RANDOM() * 15 + 15)::numeric, 2) as temperature,
  ROUND((RANDOM() * 60 + 20)::numeric, 2) as humidity,
  ROUND((RANDOM() * 1700 + 300)::numeric, 2) as co2,
  ROUND((RANDOM() * 45 + 5)::numeric, 2) as pm1_0,
  ROUND((RANDOM() * 55 + 5)::numeric, 2) as pm2_5,
  ROUND((RANDOM() * 90 + 10)::numeric, 2) as pm10,
  ROUND((RANDOM() * 9.5 + 0.5)::numeric, 2) as carbon_monoxide,
  ROUND((RANDOM() * 450 + 50)::numeric, 2) as voc
FROM generate_series(1, 10);
*/

