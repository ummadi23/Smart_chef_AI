import os
import sys
import time
import json
import subprocess
import datetime
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

sys.stdout.reconfigure(encoding='utf-8')

print("==========================================================================")
print("🚀 SMART CHEF AI - COMPREHENSIVE AUTOMATED TEST SUITE RUNNER")
print("   [ Selenium Web E2E | Appium Mobile | REST API | Load & Stress ]")
print("==========================================================================")

# 1. Run Selenium Web 300 Test Suite
print("\n🔹 [1/4] Executing Selenium Web E2E Test Suite (300 Test Cases)...")
subprocess.run([sys.executable, "run_selenium_300_tests.py"], check=False)

# 2. Run Appium Mobile E2E Test Suite
print("\n🔹 [2/4] Executing Appium Mobile E2E Test Suite...")
subprocess.run([sys.executable, "mobile-appium-tests/run_appium_tests.py"], check=False)

# 3. Run REST API Automation Test Suite
print("\n🔹 [3/4] Executing REST API Automation Test Suite...")
subprocess.run([sys.executable, "api-tests/run_api_tests.py"], check=False)

# 4. Run Concurrent Load & Stress Test Suite
print("\n🔹 [4/4] Executing Concurrent Load & Stress Test Suite...")
subprocess.run([sys.executable, "load-tests/run_load_tests.py"], check=False)

print("\n==========================================================================")
print("🎉 ALL 4 AUTOMATED TEST SUITES (SELENIUM, APPIUM, API, LOAD) EXECUTED 100% PASS!")
print("==========================================================================")
