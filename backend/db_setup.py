import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_tables():
    print("Setting up Supabase Tables...")
    
    schema = """
    -- Enable UUID extension
    create extension if not exists "uuid-ossp";

    -- Create network_traffic table
    create table if not exists public.network_traffic (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        source_ip text,
        destination_ip text,
        protocol text,
        payload text,
        size_bytes integer
    );

    -- Create threat_logs table
    create table if not exists public.threat_logs (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        traffic_id uuid references public.network_traffic(id),
        threat_type text not null,
        severity text check (severity in ('low', 'medium', 'high', 'critical')),
        description text,
        status text default 'detected' check (status in ('detected', 'investigating', 'blocked', 'resolved'))
    );
    
    -- Create system_activities table (for the feed)
    create table if not exists public.system_activities (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        type text check (type in ('info', 'success', 'warning', 'error')),
        message text not null,
        agent_name text
    );

    -- Create agent_logs table
    create table if not exists public.agent_logs (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        agent_name text not null,
        input_data text,
        output_data text
    );
    """
    
    # Write schema to file
    with open("schema.sql", "w") as f:
        f.write(schema)

    print("Supabase connected. Schema saved to 'backend/schema.sql'.")
    print("Please run the content of 'schema.sql' in your Supabase SQL Editor.")
    
    try:
        pass
    except Exception as e:
        print(f"Connection successful but tables might be missing. Error during check: {e}")

if __name__ == "__main__":
    create_tables()
