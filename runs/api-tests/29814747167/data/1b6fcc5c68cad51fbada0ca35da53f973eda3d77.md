# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/products.spec.ts >> Products API >> searchProduct without the search_product parameter returns 400
- Location: tests/api/products.spec.ts:57:7

# Error details

```
Error: apiRequestContext.fetch: Max redirect count exceeded
Call log:
  - → POST https://automationexercise.com/api/searchProduct
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 0
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:50 GMT
    - content-type: text/html; charset=utf-8
    - transfer-encoding: chunked
    - connection: keep-alive
    - referrer-policy: same-origin
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - x-powered-by: Phusion Passenger(R) 6.1.2
    - location: /
    - status: 302 Found
    - nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
    - server: cloudflare
    - cf-cache-status: DYNAMIC
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=74iT5fJ8Wdb%2BLlhM3r2CiD5w98CZr%2FCR%2BNvZIHItKI2Kkdqch0lSgPPmqQn5xc4zDW6YdUd5b57JyWJBrDqjJHIbkLFFc1Yf9o3mMsDU7t0RHj5HKbP1DweNNNDIiGzcyT8kEMRwpXcW"}]}
    - cf-ray: a1e8e1549a60ca91-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:51 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2Frc47EB%2FKEfkNT3DgbA2oF2GUGauTsUfP%2BAG7OV%2F8RX3LerVH50sJEC20gJOeNi%2FVcnvozNW0QXPspaZy3AoQAkXNGzRrCGLkO5sPQOAtNDyC0EK4tvBkEP7H2TBjmmCiLcoVBWJPZcL"}]}
    - cf-ray: a1e8e1598bf882ae-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:52 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=nWj0%2BZlT7DiZEg%2B23XLUAxMMRr5bTc0Sr%2BzGLipna8QRDlcl2kJH%2BtnAFccYEB0fJn8NQD6lF8LLu890JDsvOU%2FZpEOrx4GOA%2FAtfPFib05GxicMVk%2BQsEvCas%2BUhcbAHGsvPd60fOEx"}]}
    - cf-ray: a1e8e15e9b04f286-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:52 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=wZz5oq15dG%2FsIKDkSkwDggwrwvCgrwn6po8JAauM3VWgTVUn1HxOQlH0js5Jthls1RsxcghAL14RhA%2FQ8a6V4WL2YXJX%2FVrLHYSISn%2B%2B%2BTMn810afMeDGFuh%2FgA0%2B%2FnDKLT1DDRiczEq"}]}
    - cf-ray: a1e8e1638999706f-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:53 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Rmt9scKt6kb%2Bts24V1dtLW2fjcc08zjFL310V9NTkIuJw7%2BREGqZNN8GQx4ZETUWUCZGH3yHXpC1XBHuW00p48nEfeesXWJ7MfzLafm7IyKkGtewdcU7k8zg9FxmQUR73qorp0I6arHT"}]}
    - cf-ray: a1e8e166abc857b2-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:54 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=ec6Eibg5fpx5j8VPSfgZxGi0tmyC6OT4eBNl3JKovXBcQ%2FBgBQCGGDxTTEzbXP2JQVHUX4Xvm4USs2B5sFDmxkFO63n2vOOxbKh14hXRFAFO%2FY4RStYl2nDf1DIor5j4nFnMTF3F%2ByzJ"}]}
    - cf-ray: a1e8e16d9ed6f72b-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:55 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=WANH9sFavVZrQe6q1%2BPs6DS5D85EHJ8kxAybKFirA0e8VpN%2FgATEki%2FNOWzRVXcUOV0g320qQnpS7fVA1NINzlebu6boWAeISqm7%2FUuuc6uyN7BdkTGsDmRTW8VtYFc4Z7WahdUIGPFE"}]}
    - cf-ray: a1e8e173daa12720-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:57 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Txa76sub%2FjcOf352bXy3Zq4bSajrRFeR2j0R2Cb811rSFH3qOGgd%2BkhKMR%2FRKylxQoR4QPyK%2BogH%2FNDMrHiVbr2S0VPZsYzTnvnt9DCF%2FkgfGj6Fi4dLesXpsbpm0MpOUS3DdDz5Dyj8"}]}
    - cf-ray: a1e8e17bebaf2bdc-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:58 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=EEzaZCN4gH3jST311Amw25NyKq9DJmNP7S9Xx%2FWehFsC3LvE5GnIPw%2BeDC7FiKl5GrX94a%2BUMFBOpb3XX8lFnf87TvhXGlDFzS89qpVR93MsN5eLL6%2BJIXxGzU5aFBn16oNCIglSgUws"}]}
    - cf-ray: a1e8e1840c47f26c-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:36:59 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=ORxx0R4YN2c56%2Fk%2FSg7dmBryIwY8SkdKFe5R8RiPM7Gz8cZHXkU1CwuXoKA5eW%2B2YrAwn0AbCJ2UQeQrw%2FoGGGp39j5GIXyNibnqYI9iKTxqS1T16VyfK3GZrvECk5gvLNOcXnx8ZpCd"}]}
    - cf-ray: a1e8e18aed4272e7-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:00 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=MbUzx5gHFOIO5iaHjJWF7MdRs2MzX8TvqpLdXAECfq60SSkNDTWTgh57HxqO8YrfGh0Rw0AV2gPeQqNmw9VV6AyjNoC5Btadv3%2BOf2zua%2BsbbyW3BghUzb24Iv99ohCTaYT80XyAHkLP"}]}
    - cf-ray: a1e8e1908a86706f-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:00 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=fBUMOea8iIBoS%2BtGTcMPMWVhhWTfRrj03eMg%2FE8DCIQXnDGJWH%2FsXZgB%2BjOwC%2Fye9O%2BQ2bylm1BCJDS2AXfwJyDwf4fK7Ht%2BCo6DbjNKBdM4BKSjs0SGJnZz9EGFJAGXwDG0RVSiGK96"}]}
    - cf-ray: a1e8e196d87ff286-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:01 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=p0dwiS2Dh%2BFDIMorJFjl9eGvaxk5%2BT8wDpZzqiQP1%2B2M8GqkMpXPwbz6uWpiTi3NNjdPtH%2Fa9kokyuXZXjkoBV1AeME2h8bf9ZNOu126uYh7SwTEj7e%2FKHkqDnYzE63qKbFQD2T53rzt"}]}
    - cf-ray: a1e8e19b2f35f72b-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:02 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=4PoFdW%2BFhqB2VvnFJ3xNbxUw%2Bk1nuVXpt2jrH1ubZQ4L9stKx3%2FY7YjWfBznDcFAGfRwa0SFOy9DcRpNroF633IHT%2FSYz%2Bx3WU86LNwm%2FrhpRW0XPCL1az6vL6RyqkuVmC2IPY9F8LlT"}]}
    - cf-ray: a1e8e19f992b823c-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:03 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Z8jjaQsEMgDxeIxS8C7bmfYihMsb5l%2FnyaNHidSfrTdL9m2Bj79ikd4e90E8ohUM3TrOP91%2Bxz%2F0EKuzz1%2B2CDIeg3YeHqw4bSpdCk7upBvNdGOhTsRufSOI5TCWLAvyhyrrkHwQRYy9"}]}
    - cf-ray: a1e8e1a54d308251-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:03 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=27A1jlT%2F%2FUNEt%2FKgbyGHq2GbEluIJtE%2F8bjEHLuohfztQoY57CRavFTWln965EIOBgsmrgB0s7lfn9QZRjvDtnr4%2FAaFhDAaQKxe%2FXSsVB%2BsKkAE64rGeM8RZRF8oJpKWXvAUXmyZ5hC"}]}
    - cf-ray: a1e8e1a7dcba20ab-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:04 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=o4u1v0UuXuJzcnSWwV%2FvABvOv6ZALGoIxHy6rji58lQG2JyADDyyYPvYUMtk%2B5k6f6E6NaarFw82C5xsjid3BNwD5Uc0kL9Mhcr3Bcl%2FTFD1SRb4eX2wTT290YHWsHWt%2Ba%2F20uTfXDU5"}]}
    - cf-ray: a1e8e1ac19e6242f-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:04 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=QrgJsbKH8kFMD4zSJ34meEppWSJltLm2sZSU8Wm1HgUGBvtJRmNNcR8ZhLsDRDmaEVpaqhUIvH1PaHru9%2B1LBniABHYXygq4BfvG%2B8Op9SGGQhDucLO%2FbkEBAHeiQE%2FX%2B6%2B8BzyLGoSU"}]}
    - cf-ray: a1e8e1af2913c97d-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:05 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=bkeeqKvQUlLZUHIPB3IVY7JOAX11FktIrcyFQEII1KR5LpH%2BBSTG%2BY9niBLujp%2BalIBoTgzigFWDJt4bmmD3V4hO2QaYvVioG8dJb90Qa8qB3WVYUtGR9uSteztI9qOqk%2FX%2FV%2FvqkbBz"}]}
    - cf-ray: a1e8e1b2d9e2f26c-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:05 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=l%2BS4Q8IW7wOCdzTGju1HE%2BmOG%2BjoH%2BICD8ib07%2FGSQvVHiXWofVUcLk1i7B3v6QwSyKbATLAG7gchSN62dy55WTnR27YCj8j2x3bwRxuat%2BEl6xBuDfHMN%2BWnNmxYq2ceY0ASuI5ixnY"}]}
    - cf-ray: a1e8e1b55f68e607-IAD
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Tue, 21 Jul 2026 08:37:06 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=VMvtjhGWmZKVeVYEb93BkeNzUVVdrY8nQWDVNQmox5sn9yJ9X6U3juHOFfMFh45dXrsQnmsR1WbNwMhNpu4qugF1ojAOXH8Cxx3rfbFJuPiBonll4r5hVLwEjyAWkLavWi%2FlQHAuVW1f"}]}
    - cf-ray: a1e8e1b92f20fe38-IAD
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