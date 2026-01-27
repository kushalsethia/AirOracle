# Indoor Air Quality Monitoring Dashboard

A real-time dashboard built with React and TypeScript to monitor indoor air quality metrics from a Supabase database.

## Features

- 🌡️ **Real-time Data**: Live updates from Supabase using real-time subscriptions
- 📊 **8 Key Metrics**: Temperature, Humidity, CO₂, PM1.0, PM2.5, PM10, Carbon Monoxide, and VOC
- 🎨 **Modern UI**: Beautiful, responsive design with status indicators
- ⚡ **Fast Performance**: Built with Vite for optimal development and build performance

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project with a table for air quality data

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Copy `.env.example` to `.env`
   - Get your Supabase URL and anon key from your [Supabase project settings](https://app.supabase.com/project/_/settings/api)
   - Add them to the `.env` file:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Set up your Supabase table:**
   
   Create a table named `air_quality` (or update the table name in `useAirQuality.ts`) with the following schema:
   
   ```sql
   CREATE TABLE air_quality (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     temperature DECIMAL(5,2) NOT NULL,
     humidity DECIMAL(5,2) NOT NULL,
     co2 DECIMAL(8,2) NOT NULL,
     pm1_0 DECIMAL(8,2) NOT NULL,
     pm2_5 DECIMAL(8,2) NOT NULL,
     pm10 DECIMAL(8,2) NOT NULL,
     carbon_monoxide DECIMAL(8,2) NOT NULL,
     voc DECIMAL(8,2) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   Enable Row Level Security (RLS) and real-time:
   ```sql
   ALTER TABLE air_quality ENABLE ROW LEVEL SECURITY;
   
   -- Create a policy to allow reading (adjust as needed for your security requirements)
   CREATE POLICY "Allow public read access" ON air_quality
     FOR SELECT USING (true);
   
   -- Enable real-time
   ALTER PUBLICATION supabase_realtime ADD TABLE air_quality;
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Data Format

The dashboard expects data in the following format:

```typescript
{
  temperature: number,      // Celsius
  humidity: number,         // Percentage
  co2: number,             // ppm (parts per million)
  pm1_0: number,           // µg/m³
  pm2_5: number,           // µg/m³
  pm10: number,            // µg/m³
  carbon_monoxide: number, // ppm
  voc: number              // ppb (parts per billion)
}
```

## Status Indicators

Each metric displays a status based on health thresholds:
- 🟢 **Good**: Optimal range
- 🟡 **Moderate**: Acceptable but not ideal
- 🔴 **Unhealthy**: Concerning levels
- ⚫ **Hazardous**: Dangerous levels

## Customization

- **Table Name**: Change the table name in `src/hooks/useAirQuality.ts` (default: `air_quality`)
- **Status Thresholds**: Modify the threshold functions in `src/utils/metricHelpers.ts`
- **Styling**: Update `src/components/Dashboard.css` for custom colors and layouts

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
