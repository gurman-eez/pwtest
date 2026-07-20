# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/account.spec.ts >> Account API >> getUserDetailByEmail returns 404 for an email that was never registered
- Location: tests/api/account.spec.ts:98:7

# Error details

```
Error: apiRequestContext.fetch: Max redirect count exceeded
Call log:
  - → GET https://automationexercise.com/api/getUserDetailByEmail?email=nonexistent-94de7fd3-5ed5-4616-a1ce-976045c7eed3%40mailtest.com
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:24 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=gA4NtyOZa9MW%2FimUvMeocnVVV6%2FSql0njSIZ1JRrH0Fa2WL5xWIbp4wtk6uWkytwEd2x9FXrcq3UTRu1j5l4RpTlRgmIcL77RAEyH2McIZV9hbqOck%2FaoXUtjSeCWcHiJ0JaFzj4yo%2FR"}]}
    - cf-ray: a1e1dcd05901a619-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:25 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=bN4e5E05FQ41Nob69V7YxjHMbWnYaA4WXiL%2FStWdDOrqvc7w03%2F5hUI7fdy%2FgchdGXnAFsC%2FJJIrr397jZbnxdD%2FFefZF9rsh5AH7AgAndsMn4uvNEzDcaYk%2BK45BbSGRQem%2FoLy4S58"}]}
    - cf-ray: a1e1dcd2dee8e18c-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:25 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=ytxZO%2BIdsAy32jQ69yAvJQqKmeNyJqag9RsbboVrdV0S2BNeaELickwhrJfAx0YvS6gGz3bXmc%2BmwRWM5yzaerL8Rr3HmDC1UjulwJZhy7rI2wKpSQ92qKWQ0YfR9LQCU%2BVbZDyWDK7G"}]}
    - cf-ray: a1e1dcd56826b52d-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:25 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=TN1B7U0pNv7eyIniNvTRdQuzPFXG4UtzQccUI15CNsg%2BOYaHFhvpRzy%2B%2FJKBAp7C%2FE0Lm5K%2Bmoh5EMe%2BxKQkOmnpwVzYcCMGTkpudnbW8jiJZeYEhsC4IlWObh3t6KvUszkXpJuwstgH"}]}
    - cf-ray: a1e1dcd7eb6a2251-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:26 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=By9mDadheD%2FZ3lVtTa4YrSZi%2FIW95lAMxgykzB0e4JP98bOvBF47oMAABoy9Cn%2FPklTHGOQeHHAWscdJeDRFMNcw5T9YzlOsIT9TKIiD1uX9DnF6pwWkhDACcI0ZhLO1MYigMgPwCy72"}]}
    - cf-ray: a1e1dcda69892c93-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:26 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=BxztOEs3Yw%2FrbhymF2vdmPbWX8Gg%2B%2Bn%2BLMg7%2Fv5abPRK7I6miaAMXke0973mIt1qhrMu3Jn8ez2r0fuwlWMYZ%2BWZceZHQBSo%2FneFJGafPo8v14UFunti4N%2FangKvt9D2rt0WMWSymrnM"}]}
    - cf-ray: a1e1dcdcedabaccd-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:27 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Yse8QZisbHDRXKevoOhY8Vsj6T88%2Fi%2BzCrfS7AE%2Fcjngl6jhQJ1lAnkW%2BMkpvOqXXBXsdUby7e9Zd9DMqOQOy%2BCiOUt3mCcUoaZotDmL56mMsryKAuHZHHZl70kpot0w9hLkfUr6F4Nn"}]}
    - cf-ray: a1e1dcdf6faa6a03-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:27 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=VfxYz4S3XbqwNw1ZIJeNBGP8ZZN57p83P4uGpL3irEgTaRjYUd5MDKt0rakEPy3PFNADlAwlwh2a4GJ9qMgFoHamucd3okSbk%2Bd9G68%2B80RG0HjrChtiOu0zE6Sww7PUcL%2Bhk1dJxrhj"}]}
    - cf-ray: a1e1dce1e81a3479-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:27 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Bi0BUskXEAZZnA4%2FlE8%2BZVXheDQvXgUzD80FrCVz44xvvSKbaSucE485Qo2zYYLWDgeQRvJaGf3hiWZ7eZ1keAglr5OrQDhKvpyCLRUOUpCWluUORuO%2BaDOdcfgX55LbNh31pfVIuXeS"}]}
    - cf-ray: a1e1dce468eec55c-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:28 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=fsXnOK234iGRfuVkB7r0ZiaBjd2I0FCJ%2FxXyuanu8Eo%2F7P6sM9RB5KrvVEqTc%2B6eCgKzErizRbdQ91S9fTTttBH1Gyv3xT8Mmpci9jXkDuAAlXq7pa685VRctHtT6YxikEpp5ABIktMR"}]}
    - cf-ray: a1e1dce6fdfc6bd1-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:28 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=dZrLbEws2LOMdAuj%2FkGpo0MagXGwVI8GutbdnGLNyn7vpmirp9l5sASePA7ZHmO3bks4ZEzWiie3pvu1oXPVlAhvBkWMTUkiN5nhqivwruKmJ3q0aeUjnqS3KkazgYvIPI7N6DaSqOvl"}]}
    - cf-ray: a1e1dce99e7447a4-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:29 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=dZMdoGi3hLkqAmlGSOPXpOi48nBP%2F8RfiAp14we0LO172V3zolXfjOule6A7SXDHWRoyJD%2BbnNht4RaWp%2FGmyrbzHPZ%2F8bfkvA4JwQBbBaAeczz%2BSsigycXTL7MUZv1DPWBYgdpvykiB"}]}
    - cf-ray: a1e1dcec1838c669-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:29 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=QBJDproXNAdJhg8sC0LVs8L%2FP9id%2BRpCXr%2B1q85KIFmFHrmyEl%2F3%2BO%2F4G4%2BEri4%2B22FI42nAUhaUYGg5lgNw681e2TAenMeAD5xzMq7hioaOr%2FhnRM1g9PPStQiP0b6f7CBjRKNvhxyi"}]}
    - cf-ray: a1e1dcef0d884ff9-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:30 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=ZEhcDr0M7GOgnD5z7TD%2BEjeCwbzEgcOYMudfcRk5eapMCAkOP37fhSt2dXbDj0cs48mo3VxLMr7YG7jyTfepCfCohTIJVpyfp03GJD2m3kR02On1zf6zT46gxR7UzePFuCsJV%2FMiHpt2"}]}
    - cf-ray: a1e1dcf1b8bc9bcf-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:30 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=CnpjcpTEWl7%2Bm6t8mHMdsDe%2FnZtqhfer7wdad%2BNmEmUUMWhlp38hJ7m6IFRZsv71n8NhBZHIg9FarOdv%2FOCI0JRFbd54QZFdCVGZdE92Qou8MxNCrj7SU5bByPBbqwHn2o13UCxSUTw4"}]}
    - cf-ray: a1e1dcf42de56796-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:30 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Ku9J%2BhP2UdMkKeAuHiCrhvnHvzNxwm66niDZ40gPCQAxSBb2N4MWooRkz2YbWkvoPvMIKgJvLJfj96iUTiy5uo0VSid%2BmCJCbAdadE4Z2vNs%2FXnuKz6ozeVq%2BbRhdSdLJEZtY1uV4oFG"}]}
    - cf-ray: a1e1dcf6aa3146e0-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:31 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=OBIzHiQ0AKQWxyRyk4FcEYmyUNAdZaQqrYoFoL5FbmjPN91vttB0YqFq%2BVDUMJiomqXCm6WFDJtNnGUUrETQ9WeaV1tqTX6Kl2r8GAir8T1Dnxhn9JAckNtA5xrhnPIq0KSbNmMEeMog"}]}
    - cf-ray: a1e1dcf92fdda619-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:31 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=bBo7F%2BOK8K7rzsFs9r7vKOe1V3X222Reeai5dRGGGSsMflnGvO%2FdndiJtT3ev%2FrwceC6e7FIs%2FHBSEPRzLMh8tWct07DGmizSeyq7T1Nx3IjdLkAT%2BMuofBe1cuhQbiugFcE4E84ibIT"}]}
    - cf-ray: a1e1dcfb98334797-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:32 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=mvNFg6EbFe%2Bi2PA0L40%2B%2F5nxWhAkJ6KSRqGbGuUPqSJoSt68dMyzuRVRl4AJyrQZ8QzJuFaZs%2BSnlUZW%2B0t8mIOLyl9xUkNoSqUmrRkCVm30RoEmca7h28%2BWVCYgFkUYwmtbzr%2FoDfUn"}]}
    - cf-ray: a1e1dcfe28ee3ac6-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:32 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=R%2Bmt3iYlA%2B7bS0DSQV2ca7hr1uQjxparJXW87Kq4nnGZYsB7nuI0sEavp1KyWAdtWfeXEo%2BWdgwszvKAq7fsps2FkqW87V8rBLnt2lX45nwK%2BSSdozy8Gu9ap1FVyfqaHOGGy%2FD9G7n8"}]}
    - cf-ray: a1e1dd012c032251-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:10:32 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=1Wt3Pwf6tWiHWIRBu3b48j0eBTN1nc%2BxT0oFDVrDPwthI0ltt%2FTsTOCJz5Ymlgmz9Og2XsiNcxscI04HD1eYMAFLYMu2K0uyckJC3DBubO0TYx%2BmfhVCbIrN60ZQVU4biIsoJPCXot5v"}]}
    - cf-ray: a1e1dd03a89f17fb-DFW
    - alt-svc: h3=":443"; ma=86400

```

# Test source

```ts
  7   |   email: string;
  8   |   password: string;
  9   |   title: 'Mr' | 'Mrs';
  10  |   birthDate: string;
  11  |   birthMonth: string;
  12  |   birthYear: string;
  13  |   firstName: string;
  14  |   lastName: string;
  15  |   company?: string;
  16  |   address1: string;
  17  |   address2?: string;
  18  |   country: string;
  19  |   zipcode: string;
  20  |   state: string;
  21  |   city: string;
  22  |   mobileNumber: string;
  23  | }
  24  | 
  25  | export interface ApiResponse<T = unknown> {
  26  |   responseCode: number;
  27  |   message?: string;
  28  |   [key: string]: T | number | string | undefined;
  29  | }
  30  | 
  31  | function toAccountForm(account: AccountData): Record<string, string> {
  32  |   return {
  33  |     name: account.name,
  34  |     email: account.email,
  35  |     password: account.password,
  36  |     title: account.title,
  37  |     birth_date: account.birthDate,
  38  |     birth_month: account.birthMonth,
  39  |     birth_year: account.birthYear,
  40  |     firstname: account.firstName,
  41  |     lastname: account.lastName,
  42  |     company: account.company ?? '',
  43  |     address1: account.address1,
  44  |     address2: account.address2 ?? '',
  45  |     country: account.country,
  46  |     zipcode: account.zipcode,
  47  |     state: account.state,
  48  |     city: account.city,
  49  |     mobile_number: account.mobileNumber,
  50  |   };
  51  | }
  52  | 
  53  | /**
  54  |  * Thin wrapper around https://automationexercise.com/api_list (14 documented endpoints).
  55  |  *
  56  |  * IMPORTANT: this API always answers with HTTP 200, regardless of outcome — the real
  57  |  * result lives in the JSON body's `responseCode` (200/201 success, 400 missing param,
  58  |  * 404 not found, 405 method not supported). Never branch on `response.status()`; always
  59  |  * read `responseCode` from the parsed body, which is what `request()` below returns.
  60  |  *
  61  |  * This client does not create a browser session. `createAccount`/`verifyLogin` only
  62  |  * prepare/check data — UI tests still need to log in through LoginSignupPage to get
  63  |  * cookies in the browser context.
  64  |  */
  65  | export class ApiClient {
  66  |   constructor(private readonly context: APIRequestContext) {}
  67  | 
  68  |   async getProductsList(): Promise<ApiResponse> {
  69  |     return this.request('GET', '/api/productsList');
  70  |   }
  71  | 
  72  |   async getBrandsList(): Promise<ApiResponse> {
  73  |     return this.request('GET', '/api/brandsList');
  74  |   }
  75  | 
  76  |   async searchProduct(searchTerm: string): Promise<ApiResponse> {
  77  |     return this.request('POST', '/api/searchProduct', { form: { search_product: searchTerm } });
  78  |   }
  79  | 
  80  |   async verifyLogin(email: string, password: string): Promise<ApiResponse> {
  81  |     return this.request('POST', '/api/verifyLogin', { form: { email, password } });
  82  |   }
  83  | 
  84  |   /** Primary setup fixture call — replaces the ~15-field UI signup form with one request. */
  85  |   async createAccount(account: AccountData): Promise<ApiResponse> {
  86  |     return this.request('POST', '/api/createAccount', { form: toAccountForm(account) });
  87  |   }
  88  | 
  89  |   /** Primary teardown fixture call — guarantees cleanup without visiting /delete_account in the UI. */
  90  |   async deleteAccount(email: string, password: string): Promise<ApiResponse> {
  91  |     return this.request('DELETE', '/api/deleteAccount', { form: { email, password } });
  92  |   }
  93  | 
  94  |   async updateAccount(account: AccountData): Promise<ApiResponse> {
  95  |     return this.request('PUT', '/api/updateAccount', { form: toAccountForm(account) });
  96  |   }
  97  | 
  98  |   async getUserDetailByEmail(email: string): Promise<ApiResponse> {
  99  |     return this.request('GET', '/api/getUserDetailByEmail', { params: { email } });
  100 |   }
  101 | 
  102 |   private async request(
  103 |     method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  104 |     path: string,
  105 |     options: { form?: Record<string, string>; params?: Record<string, string> } = {}
  106 |   ): Promise<ApiResponse> {
> 107 |     const response = await this.context.fetch(path, { method, ...options });
      |                                         ^ Error: apiRequestContext.fetch: Max redirect count exceeded
  108 |     return (await response.json()) as ApiResponse;
  109 |   }
  110 | }
  111 | 
  112 | /** Throws if the API's own responseCode doesn't match what the caller expected. */
  113 | export function assertResponseCode(response: ApiResponse, expected: number): void {
  114 |   if (response.responseCode !== expected) {
  115 |     throw new Error(
  116 |       `Expected API responseCode ${expected}, got ${response.responseCode}: ${response.message ?? '(no message)'}`
  117 |     );
  118 |   }
  119 | }
  120 | 
```