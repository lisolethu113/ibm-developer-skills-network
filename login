Task 8 – User Login

Command:
Invoke-RestMethod -Uri "http://localhost:5000/customer/login" -Method Post -ContentType "application/json" -Body '{"username":"lisolethu","password":"Password123"}'

Output:
User successfull logged in
