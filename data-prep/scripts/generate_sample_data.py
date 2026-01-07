#!/usr/bin/env python3
"""
Insight Weaver — Sample Data Generator
Generates mock data for development and testing.
"""

import os
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import numpy as np
from dotenv import load_dotenv

load_dotenv()

OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_sales_data(num_records: int = 1000) -> pd.DataFrame:
    """Generate mock sales transaction data."""
    
    regions = ["North", "South", "East", "West", "Central"]
    products = ["Enterprise Suite", "Pro Plan", "Starter Kit", "Custom Solution", "Add-ons"]
    
    data = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(num_records):
        record = {
            "transaction_id": f"TXN_{i:06d}",
            "date": base_date + timedelta(days=random.randint(0, 365)),
            "region": random.choice(regions),
            "product": random.choice(products),
            "quantity": random.randint(1, 10),
            "unit_price": round(random.uniform(99, 9999), 2),
            "discount_pct": round(random.uniform(0, 0.3), 2),
            "customer_id": f"CUST_{random.randint(1, 200):04d}",
        }
        record["total"] = round(
            record["quantity"] * record["unit_price"] * (1 - record["discount_pct"]), 2
        )
        data.append(record)
    
    return pd.DataFrame(data)


def generate_metrics_data(num_days: int = 90) -> pd.DataFrame:
    """Generate mock metric time series data."""
    
    metrics = [
        ("revenue", 1_000_000, 200_000),
        ("active_users", 50_000, 5_000),
        ("conversion_rate", 0.03, 0.005),
        ("customer_satisfaction", 4.2, 0.3),
    ]
    
    dimensions = ["District 1", "District 2", "District 3", "District 7"]
    
    data = []
    base_date = datetime.now() - timedelta(days=num_days)
    
    for day in range(num_days):
        date = base_date + timedelta(days=day)
        
        for dimension in dimensions:
            for metric_name, base_value, std_dev in metrics:
                value = np.random.normal(base_value, std_dev)
                
                # Add trend
                trend_factor = 1 + (day / num_days) * 0.1
                value *= trend_factor
                
                # Add some anomalies
                if random.random() < 0.02:
                    value *= random.choice([0.7, 1.4])
                
                data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "dimension": dimension,
                    "metric": metric_name,
                    "value": round(value, 4),
                })
    
    return pd.DataFrame(data)


def generate_customer_data(num_customers: int = 500) -> pd.DataFrame:
    """Generate mock customer data."""
    
    segments = ["Enterprise", "SMB", "Startup", "Individual"]
    industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]
    
    data = []
    
    for i in range(num_customers):
        signup_date = datetime.now() - timedelta(days=random.randint(30, 730))
        
        data.append({
            "customer_id": f"CUST_{i:04d}",
            "name": f"Customer {i}",
            "email": f"customer{i}@example.com",
            "segment": random.choice(segments),
            "industry": random.choice(industries),
            "signup_date": signup_date.strftime("%Y-%m-%d"),
            "lifetime_value": round(random.uniform(1000, 100000), 2),
            "engagement_score": round(random.uniform(0, 100), 1),
            "churn_risk": round(random.uniform(0, 1), 3),
        })
    
    return pd.DataFrame(data)


def main() -> None:
    """Generate all sample datasets."""
    
    print("=" * 50)
    print("Insight Weaver — Sample Data Generator")
    print("=" * 50)
    print()
    
    # Generate and save datasets
    datasets = [
        ("sales_data.csv", generate_sales_data, {}),
        ("metrics_data.csv", generate_metrics_data, {}),
        ("customer_data.csv", generate_customer_data, {}),
    ]
    
    for filename, generator, kwargs in datasets:
        print(f"Generating {filename}...")
        df = generator(**kwargs)
        output_path = OUTPUT_DIR / filename
        df.to_csv(output_path, index=False)
        print(f"  ✓ Saved {len(df)} records to {output_path}")
    
    print()
    print("All datasets generated successfully!")
    print(f"Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
