# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-signup.spec.ts >> Login & Signup >> successful registration of a new user
- Location: tests/login-signup.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: apiRequestContext.fetch: Max redirect count exceeded
Call log:
  - → DELETE https://automationexercise.com/api/deleteAccount
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:03 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=H1CkvFyP3aKY2fqkxc1LB1cuG%2BqnPrjql%2BCdhJjOsLpv1rzMTPqx5Joim1jJiIKbK4LANamK0ZYUYurD7Agg3w5o3Xp%2By%2BFdoO08OTpQBQ7N888DASaANBwvDhMDwLeXtIhq4CFhVrtR"}]}
    - cf-ray: a1d388538d14327e-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:03 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=aKaXj6h7vHXfDWq9l3qPMjqwPmbeXfRlJ5BRh1dIbj2hqpsJ%2B0ksjkfq3zxqYZ83qbU4fcxEVG8LcsqVDEdOuS2JFWv8cE8cieZkj1Zgc8vYR5E3q4N37eZihtVNjfkwInbHGGajjK3T"}]}
    - cf-ray: a1d3885628cbcff5-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:04 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=9XMtIVwqPxD%2B1kN8zTc1TnxgbfCGc8tEzsb1gawEmc8E3DqFs27Q2gt%2FYlXbiaiw0Kharv8ED35zQLuuHfMRMY%2FEeJHuXyhoQF5O6LQvjobbJJPE0p%2FQtbuPd9IXth3GnUerczjWFEYy"}]}
    - cf-ray: a1d388585a4cce48-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:04 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=XqWDrQhkvicGdcrs7BoeWEuPB%2FYluwBAPuBvkMsC01%2B6JZ6jmelgOEhh%2BUzZCzUkpicGqI7oae3LHNugw4rtijsB3xGY4sNx3cTVO40VfGLsqWwkQBcKqxNHC7iwRc8QRWhiylEWrzly"}]}
    - cf-ray: a1d3885a8bb8ccb8-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:05 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=BGnm68XlACmkinRPab9XTZ5jsg0DSOJ9Frf2ysvvmsT9bYetrR0Tjl9XrAVac%2FQXjslK7p24RZar2lNu9N09QacAKCpg59lC6FsWH9LlssgKPsPxp%2BMSGWwvdplJgK%2BMiiomxeFtmWrf"}]}
    - cf-ray: a1d3885d48a50b82-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:05 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=4r%2FC0bPv1YA4fsUc%2F0Cz%2FC9hUpRBvZ0L9gRghrBjFa1dRaILeHQ26bAixnfWjQBAbQn98nMwdABcetA%2F6qizWdEya6%2FxeE5gGf1QeWp57ITFis%2BnTmz7n4XvYINq8eEv%2BzaCfEYhOll%2B"}]}
    - cf-ray: a1d3885f7e3a67fc-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:05 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=nhW%2BU7H6gHeF5gUhhGD80y%2Bpj%2BEO%2FWd8SX4yuJJ0qOtPn0wI2ULKi69ekRHGhaDrUXJo2iL4FKyDTNBM1hxQnKg1ZFUyL7JS7xtxZsI%2FIbZIQiORaF9BfHsARPqgalOPmw5ijqggN5H9"}]}
    - cf-ray: a1d38861c8aefa7e-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:06 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=5jvWAjSlw8CStBY9Rh07iloUXIUdMh5Xh3nr8AweCmcZcRUTY6oJIcx8ow0wv07Tmml3DFcrH2smhwwB1%2BHjAZBCUDo6g03Ltmp0cf2fLTEDysVv7iNvnSZBY3KkZF%2BrnrHSkNCWAAPp"}]}
    - cf-ray: a1d38863f8d66ad1-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:06 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=pf1E%2Fy2lrR5C1cVgPzZLSWx4OmWh1P2cipCEqaPO5CfI3cQ0PRd3hiMvNACIfvHp5G%2FuFCH0yDjBRucn%2B8oohEvVP2TTijdFUYT1o9lHGrOuzSgCquBPw2I9bYuHR6qE6qiCL%2F%2FwkXL1"}]}
    - cf-ray: a1d388661e67f4d9-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:06 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=vE25YSZ0k8rOMZyxj6qaDwsq1vvazPQrBu87a7ywWx%2BVKRbklLADPwFlS2PKTVkaSGwjMdre0TTencrBthCgVHPAvidyU3A0ShkBBaKh59BDP83%2B4DLt0e8gf%2FQDk3AI3afTFXoZvu3b"}]}
    - cf-ray: a1d388685bb6ebe4-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:07 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=QbH49qo%2Fy4%2FmRKqVOrrYSP0S%2FCus%2FaJ9FPbkXfbgPVku2yKAdSUhvElt6vG9RdZft1UKRAH31A4oUfGJAzNekh6Ii3FN8B3P7SDHO8eP%2FArJbfoS3O53tKuFEXXjy3No%2Fe9dG1p1u2cZ"}]}
    - cf-ray: a1d3886a7cd9f9ed-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:07 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=XluGKwSEnviPCtDEKrUIZsE7WGmxYSDQCs1ANKofd1iRgt%2FF5gprlsDpmpQlOxQ5i1%2BXHPdoUwdx3p96d1T0g9o4TLttJf7CS4bflYBX5C7AwAg%2BAssg0RAedywjgv3%2BKXFutG8w1Qdf"}]}
    - cf-ray: a1d3886cad666798-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:07 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2BYG%2BYccnQEzUR8CpfMuXmd2Ge7czLQJwVmZwO6l2rtVJeRE2H46NBoDEYk%2FXzrRN4He7WF%2Fh%2Bw1Sn5himJ4vVi9s4EONXgvOimf7V1endBhtGW6dCp81coB25whye6ZzT0kbIyhIGXa6"}]}
    - cf-ray: a1d3886f1aac8462-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:08 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=XNpodDPwruiwmkne%2BFFn3ONt%2FXbyrU%2ByXMZvsWE45N%2FNdrzZw%2BRZChUMkRVeBA%2B1IhZCa9nSw7TgksFEHe0n5T7BdpZN0qeekphIXhfx2RNEgG3%2BJQ2v6Ptm1esd70mfU7dz4Vi4Ai69"}]}
    - cf-ray: a1d388714ef7f8f3-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:08 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=cT%2F9vQvR0yDdH4i1HGumYgI82lzTY5uiZEgXGFW4lBCQE3yNguAHy89s3hRrPSDiUkpUJgS3q0TBMV9n6FoSrB8WrRSvT%2FBWuZ93s4MPGvCH9g%2F4voRTIueWYXBZNXPejyfh4XjUpG49"}]}
    - cf-ray: a1d388737d868acf-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:08 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=kcwnnGGILjPm6tc62aDFqGNwe7KqwQ37ru5sGFAeH4MolV8T1CzVLVKAoiT9b6dc%2F%2BHpm6YcVbV%2BT1K7j%2FHdKaVa8nc1PZW%2FEaWjgizNSsq5Pj9Mt1yTl7bpfhWix1jW8bfwdqfo1caz"}]}
    - cf-ray: a1d388759e63d8a7-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:09 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=uiGqfLD0KDxJOusNrKTJS9k2llRV67precZAjZbWIaZdDCCCYi3BJyv%2FI7DLXOcZmM4RJN4FS03oDK1jOMDnOGMsM1AXVRlcVkKEf%2BJmGVl0iwLFwHYB94FG3SYJETtZr%2BIb53%2B3I523"}]}
    - cf-ray: a1d38877c9fe8775-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:09 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=drVdOJvPZ8cnnttspy7XqFRQ4y%2FXYdpEdNO5bv33lXoansatXLLQbUBNV1aKeYhmVkgIWSJLvlYUChhcOm6zWCEDhCaPZg2ZQ7P3dW3UJi8sYwCDINeQxdqgbSzhGYZzJjNQntP9Nf12"}]}
    - cf-ray: a1d38879eec9f4c4-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:09 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=RwcvYuqCVSdQONm3ymtEPll7UXxIwShOokbLSjDF5O8YGYZq9QHR9c2G5iwnMHQphfpargKlL%2F2lPSMF0%2FVnpgJFeImGRLemHdG7Wwn9S6GdIHKXMeboHjusMXdDfJpiIFfKeqryb7A7"}]}
    - cf-ray: a1d3887c1d36ebe5-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:10 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=z0%2FagUrukLxBuFksJhS9c%2BYIFiT88VXWtt2bAkStocnH9T4J9IjDIhqukvUTomvPfU3j9s4kXl7f42RMbRvtrK6Va8xu6%2FJCX%2FU9iw9mUyAbdaXPWqBcAyS450XUcnLQ8DMUC4p%2BYsg4"}]}
    - cf-ray: a1d3887e4c46327e-SJC
    - alt-svc: h3=":443"; ma=86400
  - → DELETE https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 61
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:26:10 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=KI2%2FnFoimaxn9Z0HaqKf41I9vFbdZtg0dRbHYpMSNGofzOrUU%2F583We4RRQr4a4h7sn3vGoS5zsLWD7FNakIiM64naxGsooTg2qOOcY1Cz4tPfLEWUwpZL6lfvKfMYI4R7X4xeTzerM5"}]}
    - cf-ray: a1d388806f4fcf12-SJC
    - alt-svc: h3=":443"; ma=86400

```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-qa="signup-name"]')

```

# Page snapshot

```yaml
- generic [ref=e4]: Please wait while your request is being verified...
```

# Test source

```ts
  11  |  * Information step (/signup) only has confirmed `id` attributes (`data-qa` is
  12  |  * present on some fields, e.g. first_name, but wasn't exhaustively verified
  13  |  * live) — id locators are used there instead. The Create Account / Continue
  14  |  * buttons and the confirmation headings weren't captured with an attribute in
  15  |  * the research pass, so they use role+text locators, which are stable enough
  16  |  * without guessing an unconfirmed data-qa value.
  17  |  */
  18  | export class LoginSignupPage {
  19  |   // --- Login form (data-qa confirmed) ---
  20  |   readonly loginEmailInput: Locator;
  21  |   readonly loginPasswordInput: Locator;
  22  |   readonly loginButton: Locator;
  23  |   readonly loginErrorMessage: Locator;
  24  | 
  25  |   // --- Signup mini-form on /login (data-qa confirmed) ---
  26  |   readonly signupNameInput: Locator;
  27  |   readonly signupEmailInput: Locator;
  28  |   readonly signupButton: Locator;
  29  |   readonly signupErrorMessage: Locator;
  30  | 
  31  |   // --- Account Information step on /signup (id confirmed) ---
  32  |   readonly titleMrRadio: Locator;
  33  |   readonly titleMrsRadio: Locator;
  34  |   readonly accountPasswordInput: Locator;
  35  |   readonly birthDaySelect: Locator;
  36  |   readonly birthMonthSelect: Locator;
  37  |   readonly birthYearSelect: Locator;
  38  |   readonly newsletterCheckbox: Locator;
  39  |   readonly optinCheckbox: Locator;
  40  |   readonly firstNameInput: Locator;
  41  |   readonly lastNameInput: Locator;
  42  |   readonly companyInput: Locator;
  43  |   readonly address1Input: Locator;
  44  |   readonly address2Input: Locator;
  45  |   readonly countrySelect: Locator;
  46  |   readonly stateInput: Locator;
  47  |   readonly cityInput: Locator;
  48  |   readonly zipcodeInput: Locator;
  49  |   readonly mobileNumberInput: Locator;
  50  |   readonly createAccountButton: Locator;
  51  | 
  52  |   // --- Confirmation / lifecycle screens (role+text, unconfirmed attributes) ---
  53  |   readonly accountCreatedHeading: Locator;
  54  |   readonly accountDeletedHeading: Locator;
  55  |   readonly continueButton: Locator;
  56  |   readonly logoutLink: Locator;
  57  |   readonly deleteAccountLink: Locator;
  58  |   readonly loggedInAsText: Locator;
  59  | 
  60  |   constructor(private readonly page: Page) {
  61  |     this.loginEmailInput = page.locator('[data-qa="login-email"]');
  62  |     this.loginPasswordInput = page.locator('[data-qa="login-password"]');
  63  |     this.loginButton = page.locator('[data-qa="login-button"]');
  64  |     this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
  65  | 
  66  |     this.signupNameInput = page.locator('[data-qa="signup-name"]');
  67  |     this.signupEmailInput = page.locator('[data-qa="signup-email"]');
  68  |     this.signupButton = page.locator('[data-qa="signup-button"]');
  69  |     this.signupErrorMessage = page.getByText('Email Address already exist!');
  70  | 
  71  |     this.titleMrRadio = page.locator('#id_gender1');
  72  |     this.titleMrsRadio = page.locator('#id_gender2');
  73  |     this.accountPasswordInput = page.locator('#password');
  74  |     this.birthDaySelect = page.locator('#days');
  75  |     this.birthMonthSelect = page.locator('#months');
  76  |     this.birthYearSelect = page.locator('#years');
  77  |     this.newsletterCheckbox = page.locator('#newsletter');
  78  |     this.optinCheckbox = page.locator('#optin');
  79  |     this.firstNameInput = page.locator('#first_name');
  80  |     this.lastNameInput = page.locator('#last_name');
  81  |     this.companyInput = page.locator('#company');
  82  |     this.address1Input = page.locator('#address1');
  83  |     this.address2Input = page.locator('#address2');
  84  |     this.countrySelect = page.locator('#country');
  85  |     this.stateInput = page.locator('#state');
  86  |     this.cityInput = page.locator('#city');
  87  |     this.zipcodeInput = page.locator('#zipcode');
  88  |     this.mobileNumberInput = page.locator('#mobile_number');
  89  |     this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  90  | 
  91  |     this.accountCreatedHeading = page.getByRole('heading', { name: 'Account Created!' });
  92  |     this.accountDeletedHeading = page.getByRole('heading', { name: 'Account Deleted!' });
  93  |     this.continueButton = page.getByRole('link', { name: 'Continue' });
  94  |     this.logoutLink = page.getByRole('link', { name: 'Logout' });
  95  |     this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
  96  |     this.loggedInAsText = page.getByText('Logged in as');
  97  |   }
  98  | 
  99  |   async goto(): Promise<void> {
  100 |     await this.page.goto('/login');
  101 |   }
  102 | 
  103 |   async login(email: string, password: string): Promise<void> {
  104 |     await this.loginEmailInput.fill(email);
  105 |     await this.loginPasswordInput.fill(password);
  106 |     await this.loginButton.click();
  107 |   }
  108 | 
  109 |   /** Step 1 of registration: name + email on /login, submits into /signup. */
  110 |   async startSignup(name: string, email: string): Promise<void> {
> 111 |     await this.signupNameInput.fill(name);
      |                                ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  112 |     await this.signupEmailInput.fill(email);
  113 |     await this.signupButton.click();
  114 |   }
  115 | 
  116 |   /** Step 2 of registration: full "Enter Account Information" form on /signup. */
  117 |   async fillAccountInformation(account: AccountData): Promise<void> {
  118 |     await (account.title === 'Mr' ? this.titleMrRadio : this.titleMrsRadio).check();
  119 |     await this.accountPasswordInput.fill(account.password);
  120 |     await this.birthDaySelect.selectOption(account.birthDate);
  121 |     await this.birthMonthSelect.selectOption(account.birthMonth);
  122 |     await this.birthYearSelect.selectOption(account.birthYear);
  123 | 
  124 |     await this.firstNameInput.fill(account.firstName);
  125 |     await this.lastNameInput.fill(account.lastName);
  126 |     if (account.company) await this.companyInput.fill(account.company);
  127 |     await this.address1Input.fill(account.address1);
  128 |     if (account.address2) await this.address2Input.fill(account.address2);
  129 |     await this.countrySelect.selectOption(account.country);
  130 |     await this.stateInput.fill(account.state);
  131 |     await this.cityInput.fill(account.city);
  132 |     await this.zipcodeInput.fill(account.zipcode);
  133 |     await this.mobileNumberInput.fill(account.mobileNumber);
  134 |   }
  135 | 
  136 |   async submitAccountCreation(): Promise<void> {
  137 |     await this.createAccountButton.click();
  138 |   }
  139 | 
  140 |   async logout(): Promise<void> {
  141 |     await this.logoutLink.click();
  142 |   }
  143 | 
  144 |   async deleteAccount(): Promise<void> {
  145 |     await this.deleteAccountLink.click();
  146 |   }
  147 | }
  148 | 
```