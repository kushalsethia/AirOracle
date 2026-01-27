# Complete Codebase Explanation

## 📁 Project Structure

```
Capstone/
├── src/
│   ├── main.tsx              # Entry point - starts React app
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── App.css               # App-specific styles
│   │
│   ├── components/           # React UI components
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   ├── Dashboard.css    # Dashboard styles
│   │   ├── MetricCard.tsx    # Reusable metric card component
│   │   └── ErrorBoundary.tsx # Error handling component
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useAirQuality.ts # Hook for fetching air quality data
│   │
│   ├── lib/                  # External library configurations
│   │   └── supabase.ts       # Supabase client setup
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── airQuality.ts    # Data type interfaces
│   │
│   └── utils/                # Helper functions
│       └── metricHelpers.ts  # Status calculation functions
│
├── .env                      # Environment variables (Supabase credentials)
├── package.json              # Dependencies and scripts
└── supabase-setup.sql        # SQL script to create database table
```

---

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Supabase** - Backend database and real-time subscriptions
- **CSS** - Styling (no framework)

---

## 📄 File-by-File Explanation

### 1. `package.json`
**Purpose:** Defines project dependencies and scripts

**Key Dependencies:**
- `@supabase/supabase-js` - Supabase client library
- `react` & `react-dom` - React framework
- `recharts` - (Installed but not used yet - for future charts)

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

### 2. `src/main.tsx` - Entry Point
**Purpose:** Initializes React and renders the app

**What it does:**
1. Finds the `#root` element in `index.html`
2. Creates a React root
3. Wraps the app in:
   - `StrictMode` - React development checks
   - `ErrorBoundary` - Catches and displays errors gracefully
4. Renders the `App` component

**Code Flow:**
```
main.tsx → ErrorBoundary → App → Dashboard
```

---

### 3. `src/App.tsx` - Root Component
**Purpose:** Simple wrapper that renders the Dashboard

**Why it exists:**
- Keeps the entry point clean
- Easy to add routing or other features later
- Standard React pattern

---

### 4. `src/lib/supabase.ts` - Database Connection
**Purpose:** Creates and exports the Supabase client

**What it does:**
1. Reads environment variables from `.env`:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your publishable API key

2. Creates a Supabase client using these credentials

3. Handles errors gracefully:
   - If credentials are missing, creates a placeholder client
   - Prevents the app from crashing if Supabase isn't configured

**Why `VITE_` prefix?**
- Vite only exposes environment variables that start with `VITE_`
- This is a security feature

---

### 5. `src/types/airQuality.ts` - Type Definitions
**Purpose:** Defines TypeScript interfaces for type safety

**Interfaces:**

**`AirQualityData`** - Structure of data from Supabase:
```typescript
{
  id?: string                    // Database record ID
  temperature: number            // Celsius
  humidity: number               // Percentage
  co2: number                   // ppm (parts per million)
  pm1_0: number                 // µg/m³
  pm2_5: number                 // µg/m³
  pm10: number                  // µg/m³
  carbon_monoxide: number       // ppm
  voc: number                   // ppb (parts per billion)
  created_at?: string           // Timestamp
}
```

**`MetricCardProps`** - Props for the MetricCard component:
```typescript
{
  title: string                 // e.g., "Temperature"
  value: number                 // The actual measurement
  unit: string                  // e.g., "°C", "ppm"
  icon: string                  // Emoji icon
  color: string                 // Base color
  status?: 'good' | 'moderate' | 'unhealthy' | 'hazardous'
}
```

**Why TypeScript?**
- Catches errors before runtime
- Provides autocomplete in your IDE
- Makes code self-documenting

---

### 6. `src/hooks/useAirQuality.ts` - Data Fetching Hook
**Purpose:** Custom React hook that fetches and subscribes to air quality data

**How React Hooks Work:**
- Hooks are functions that start with `use`
- They can use React features like `useState` and `useEffect`
- Components call hooks to get data or functionality

**What this hook does:**

1. **State Management:**
   ```typescript
   const [data, setData] = useState<AirQualityData | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   ```
   - `data` - The air quality data (or null if no data)
   - `loading` - True while fetching
   - `error` - Error message if something goes wrong

2. **Initial Data Fetch:**
   - When component mounts, fetches the most recent record
   - Queries: `SELECT * FROM air_quality ORDER BY created_at DESC LIMIT 1`
   - Updates state with result

3. **Real-Time Subscription:**
   - Sets up a Supabase real-time channel
   - Listens for INSERT, UPDATE, DELETE events on the `air_quality` table
   - When new data arrives, automatically updates the `data` state
   - **No page refresh needed!**

4. **Cleanup:**
   - When component unmounts, removes the subscription
   - Prevents memory leaks

**Returns:**
```typescript
{ data, loading, error }
```

**Usage in component:**
```typescript
const { data, loading, error } = useAirQuality()
```

---

### 7. `src/components/Dashboard.tsx` - Main UI Component
**Purpose:** The main dashboard that displays all air quality metrics

**Component Structure:**

1. **Calls the hook:**
   ```typescript
   const { data, loading, error } = useAirQuality()
   ```

2. **Handles three states:**

   **a) Loading State:**
   - Shows spinner while fetching data
   - Prevents showing empty/broken UI

   **b) Error State:**
   - Shows error message
   - Provides troubleshooting tips
   - Helps user understand what went wrong

   **c) No Data State:**
   - Shows "No data available" message
   - Provides "Insert Test Data" button
   - Allows testing the dashboard without real hardware

   **d) Data State:**
   - Shows full dashboard with 8 metric cards
   - Displays last updated timestamp

3. **Renders 8 MetricCard components:**
   - Temperature, Humidity, CO₂, PM1.0, PM2.5, PM10, Carbon Monoxide, VOC
   - Each card gets:
     - The value from data
     - Status (good/moderate/unhealthy/hazardous) from helper functions
     - Icon and color

4. **Test Data Function:**
   - Allows inserting sample data for testing
   - Useful for development and demos

---

### 8. `src/components/MetricCard.tsx` - Reusable Card Component
**Purpose:** Displays a single air quality metric

**What it receives (props):**
- `title` - "Temperature", "Humidity", etc.
- `value` - The numeric measurement
- `unit` - "°C", "%", "ppm", etc.
- `icon` - Emoji icon
- `color` - Base color
- `status` - Health status

**What it does:**
1. Calculates status color based on health level:
   - `good` → Green (#10b981)
   - `moderate` → Yellow (#f59e0b)
   - `unhealthy` → Red (#ef4444)
   - `hazardous` → Dark red (#7c2d12)

2. Renders:
   - Icon with status color
   - Title
   - Large value number with unit
   - Status badge (GOOD, MODERATE, etc.)

**Why a separate component?**
- Reusable - used 8 times in Dashboard
- Cleaner code - Dashboard doesn't need to know card details
- Easier to modify - change card design in one place

---

### 9. `src/utils/metricHelpers.ts` - Status Calculation Functions
**Purpose:** Determines health status based on measurement values

**Functions:**
- `getTemperatureStatus(temp)` - Returns 'good' if 20-25°C
- `getHumidityStatus(humidity)` - Returns 'good' if 30-60%
- `getCO2Status(co2)` - Returns 'good' if < 1000 ppm
- `getPM25Status(pm25)` - Returns 'good' if < 12 µg/m³
- `getPM10Status(pm10)` - Returns 'good' if < 54 µg/m³
- `getCOStatus(co)` - Returns 'good' if < 9 ppm
- `getVOCStatus(voc)` - Returns 'good' if < 250 ppb

**How it works:**
Each function checks the value against thresholds:
```typescript
if (value < threshold1) return 'good'
if (value < threshold2) return 'moderate'
if (value < threshold3) return 'unhealthy'
return 'hazardous'
```

**Why separate functions?**
- Each metric has different thresholds
- Easy to adjust thresholds per metric
- Clean, testable code

---

### 10. `src/components/ErrorBoundary.tsx` - Error Catcher
**Purpose:** Catches React errors and displays a friendly error screen

**How it works:**
1. Wraps the entire app in `main.tsx`
2. If any component throws an error, catches it
3. Displays error message instead of blank page
4. Shows stack trace for debugging
5. Provides reload button

**Why needed?**
- Prevents entire app from crashing
- Better user experience
- Helps with debugging

**React Class Component:**
- Uses class component (not function component)
- Required for error boundaries in React
- Only class components can be error boundaries

---

## 🔄 Data Flow

### Complete Flow Diagram:

```
1. User opens browser
   ↓
2. main.tsx runs
   ↓
3. ErrorBoundary wraps App
   ↓
4. App renders Dashboard
   ↓
5. Dashboard calls useAirQuality() hook
   ↓
6. Hook fetches data from Supabase
   ↓
7. Hook sets up real-time subscription
   ↓
8. Data returned to Dashboard
   ↓
9. Dashboard renders 8 MetricCard components
   ↓
10. Each MetricCard displays one metric
    ↓
11. User sees dashboard!

When new data arrives:
   ↓
12. Supabase sends real-time update
   ↓
13. Hook receives update
   ↓
14. Hook updates state
   ↓
15. Dashboard re-renders automatically
   ↓
16. User sees updated values (no refresh!)
```

---

## 🔌 Real-Time Updates Explained

**How Supabase Real-Time Works:**

1. **Subscription Setup:**
   ```typescript
   supabase
     .channel('air-quality-changes')
     .on('postgres_changes', { table: 'air_quality' }, callback)
     .subscribe()
   ```

2. **What Happens:**
   - Supabase creates a WebSocket connection
   - Listens to PostgreSQL change events
   - When your monitoring system inserts data, PostgreSQL triggers an event
   - Supabase sends the event through WebSocket
   - Your app receives it and updates the UI

3. **Why It's Fast:**
   - No polling (checking every few seconds)
   - Instant updates when data changes
   - Efficient - only sends data when it changes

---

## 🎨 Styling

**CSS Files:**
- `index.css` - Global reset and base styles
- `App.css` - App-level styles
- `Dashboard.css` - Dashboard-specific styles

**Design Features:**
- Gradient background (purple to blue)
- Card-based layout
- Responsive grid (adapts to screen size)
- Color-coded status indicators
- Smooth animations and transitions

---

## 🔐 Environment Variables

**`.env` file:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key-here
```

**Security:**
- Never commit `.env` to git (it's in `.gitignore`)
- Publishable key is safe for client-side use
- Never use service role key in frontend

---

## 📊 Database Schema

**Table: `air_quality`**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| temperature | DECIMAL(5,2) | Temperature in Celsius |
| humidity | DECIMAL(5,2) | Humidity percentage |
| co2 | DECIMAL(8,2) | CO₂ in ppm |
| pm1_0 | DECIMAL(8,2) | PM1.0 in µg/m³ |
| pm2_5 | DECIMAL(8,2) | PM2.5 in µg/m³ |
| pm10 | DECIMAL(8,2) | PM10 in µg/m³ |
| carbon_monoxide | DECIMAL(8,2) | CO in ppm |
| voc | DECIMAL(8,2) | VOC in ppb |
| created_at | TIMESTAMP | Auto-generated timestamp |

**Setup:**
- Run `supabase-setup.sql` in Supabase SQL Editor
- Creates table, enables RLS, sets up real-time

---

## 🚀 How to Extend

**Add a new metric:**
1. Add column to database table
2. Update `AirQualityData` interface
3. Add MetricCard in Dashboard
4. Add status function in metricHelpers

**Add charts:**
- `recharts` is already installed
- Create a new component using recharts
- Add it to Dashboard

**Add historical data view:**
- Modify `useAirQuality` to fetch multiple records
- Display in a table or chart
- Add date range selector

---

## 🐛 Common Issues & Solutions

**Blank page:**
- Check browser console for errors
- Verify `.env` file exists and has correct values
- Restart dev server after changing `.env`

**"Table not found" error:**
- Run `supabase-setup.sql` in Supabase
- Check table name matches (default: `air_quality`)

**No real-time updates:**
- Verify real-time is enabled in Supabase
- Check browser console for subscription errors
- Ensure RLS policies allow reads

---

## 📝 Key Concepts

**React Hooks:**
- `useState` - Store component state
- `useEffect` - Run side effects (API calls, subscriptions)
- Custom hooks - Reusable logic (like `useAirQuality`)

**TypeScript:**
- Type safety - catches errors before runtime
- Interfaces - define data structures
- Type imports - `import type` for types only

**Supabase:**
- Backend as a Service (BaaS)
- PostgreSQL database
- Real-time subscriptions
- REST API

**Component Architecture:**
- Parent → Child data flow
- Props down, events up
- Separation of concerns

---

This codebase follows React best practices and is designed to be maintainable, scalable, and easy to understand! 🎉

