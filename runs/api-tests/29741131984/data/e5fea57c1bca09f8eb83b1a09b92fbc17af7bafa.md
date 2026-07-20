# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/login.spec.ts >> Login API >> verifyLogin with a missing password field returns 400
- Location: tests/api/login.spec.ts:37:7

# Error details

```
Error: apiRequestContext.fetch: Max redirect count exceeded
Call log:
  - → POST https://automationexercise.com/api/createAccount
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/x-www-form-urlencoded
    - content-length: 303
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:11 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=JxM8BadnPMf4O1KlwhT7tA6p7PLfk8aLvxEiQkzKQF2Ff2di4wpPHcvLWLqhwLr9heuYFMGHcOTgcpOSV2N6uxZw6b83eAKqcU0gu53JEK9BSs9rBT7RuWXT3PjSiYAxqP8xC271eDUs"}]}
    - cf-ray: a1e1ddf5edfcf0a1-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:12 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=a%2B0BVn7c8FwX5NEe9IDOfroIXlD8pjgAHlradxsICDDv34ivnREpuNKOtsQkTALMSZUKjkBlKh%2BGnHKa20hapHcBrkq04T9tx3XwBjCeJdBs%2BHw1PbIZ%2BAv9wIJ6ByRXIO64F%2Bfr21mn"}]}
    - cf-ray: a1e1ddf8e988a619-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:12 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=YzVLboYTJUpyVvkF0dt%2BpxxN0c%2Ba2b7vlgSa1MOtRWkvC0O1fLPFW%2F%2FApRF4XKbWJWkN4ksG%2F2Wam%2BmksO5oa7btJy1G0Iq66GGr%2F%2FsifmTCFOrvWKs4bPNhMyCQj2DfvhijMMwKnbDk"}]}
    - cf-ray: a1e1ddfb69c64797-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:12 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=oTAF0v%2FU%2Fhs%2B0Qw1LHVySfD%2BFQmPrUfkGYna8FDCaF8xkXitqA8Ndt8tNB%2FjvjTBZK9kzOuGv7hreM0mmC0afqi8%2F8YkR3khFDierqUfSXpO%2FDp6JFjaclyOt7oXWAqMss%2B45qvEzf0r"}]}
    - cf-ray: a1e1ddfdea253479-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:13 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=5CdXkd1FwiZwObcoXVNQ%2BNnQRPaEuR9RY8Lq62ceJP5hi7aTE3mOU6dbzBZjJGAF98UtTHvxXnlmiZzw2fm3WfEl4p33Ids0uKZxdSfz0%2BU0BBuczCz4TOe0r%2FOY8nDh2UQ5tp5jD5de"}]}
    - cf-ray: a1e1de00781daccd-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:13 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=DnpdxKxtd5cnoPDRGBeTADdVpe4zoZ6gW0ZhQKoiaN36KE9galrmcJ4bABZW5AOcelk8KDjrX7n18D8FOhr0e7aePOhRsm6Qz6zO2oCt2a1CxcABhpa2dWIU9RTkoh%2FyQ4OlLVLa%2Bjrc"}]}
    - cf-ray: a1e1de02fb4ab52d-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:14 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=iGdaWO7vy0PEYI3IPFxcj8TrIvDBEcXTASzKDSNap8uQA6oHc5%2FjdHAv0R6oCoYTTUoNBPEr9pgyHYeBAAeAreJfiV0Te%2FWu6ZhYwBOowbWcEieq9AMcScnYgY5DpcW0tYHOIBONAu7c"}]}
    - cf-ray: a1e1de057be917fb-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:14 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=Kc4qiFNIpYhr%2FPML3O43tXNcIu3W62GOa6ojBAVZ7juGd7TB4SUSKQJhVl0cikGkvTZ0B88zoRpyiC3QoX96OdKZv2kl4iOtXrKz37rgad9l0vlsT0jfzVvebexLpSRfGbv7oWg25Qjd"}]}
    - cf-ray: a1e1de091fde2251-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:15 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=I%2FuvszvONf%2FKq4OTM71vF1360%2F3drMsdYHduDryr9ZmEoL9jy6I9EL7K72LMyQjDOrlssMY3gkU8sx2ztIa50hr7kWt%2FLs2JY28h1ZHXK9IHnB3FKcW830Asyo36BoU7Rsp08EY7MA%2FZ"}]}
    - cf-ray: a1e1de0ba9692c93-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:15 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=YbtykuQfFk5zofsaCaaEDJ1PtzevVg8dDocJhQXfDPXRlnUmLbySMeEdHVbADU9gAI8JYFnxKSMq8uqaI97Cr5hzgMTWHw99gItCAzSgS3s4OCkeCeSAkKBy1bkAgL1zxRglFi63XS8R"}]}
    - cf-ray: a1e1de0e2f8e1807-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:15 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=H%2BOhSQKdb%2FEecfBSkQYOZdrEdGqsaEQaCTXoiYI24lZ%2FJGqLLfd4FDTa3960EgqewnHXXQTEf5TZemzFc%2B9IZ5UfCFXeOtCjL69nz32mdt860%2FHkdWZBvJ2gfwwGh3Aw1QWyr5CL%2FPRm"}]}
    - cf-ray: a1e1de109ce4c669-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:16 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=eLp85BrWXzxqhCGtUKs9KKL9Sw6ll3c6YQSFXuWd0wA0oOcZDTPCKSxnuiG%2FoGw%2FjYnBLSZl5aaHBbzzzSGTPLqu9vPUVRipIAghiTQRdQr1CVs0EHD%2BeVUvxXciLvLHZ1vPJqu%2B%2FQmF"}]}
    - cf-ray: a1e1de131801a91e-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:16 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=RMSnGC3C8ET2ArnW0%2BqBTvJx0nukU2yJYxlibYfsp2yz8YUrvI5DSb7kk4bfyIzpz8Na7f5qHrq741EJ230MRuqaU%2BJcwdps%2BjcrCRsZUysRaOGnx3KpvjAG48qRgWeYYICsqPWXJC4I"}]}
    - cf-ray: a1e1de158f76c55c-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:17 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=gCSdMeZM5oFDPt4f7EskTvf7XTRW485%2FpbSWVNJs3PgBu6TbXRT%2BgdizSV6SNXuwAQo8plXZltSqN2BLxBpxoVSPBRQGjWOzWuxvZeVCUPcohO0oDwiPCjPVEgqtoiGhGGAUR%2BVPyI5q"}]}
    - cf-ray: a1e1de18089a47a4-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:17 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=jBEMyS2yp%2FStKgSZQCiDXEwAGXqX93bT%2BJtQYP9iK366rDp2%2FFcZ2ZsiTx%2FVty11DIbLg4LsQNUOBbTm6IR3x3hta%2BaIOIajnlCOJDBAFEJ%2F96%2B34dW8JsjInEqMIVAyis1ld6ns%2FTsb"}]}
    - cf-ray: a1e1de1a9ef56bd7-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:17 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2FrjueI6MbnYjrdpwJoGoZH%2BuIR8EHDycSZlHt5yQ8uz4lJqE%2BV6IM0z3K53ujhAa6WYJVzA0sMAOYl7mXe%2B6aX2syIOKxzZxStMiBVQsDKdnxUKUEEyaX8WCHGYY9zRgwB%2F8M3lHM1fM"}]}
    - cf-ray: a1e1de1d2acf4624-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:18 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=69C4zygppd8nbJUZVOeG62dmSkKC8qpNXBG2tsk2jbcrJ20tomssA8nd6Pp7k6hCusImawt%2Bkcb1GtEDeXBkGDiCAqnqEzYJdDDDAjesXVmsBYjbs6MHy1IeLHs1a7BYR0el8DUfZ%2Bru"}]}
    - cf-ray: a1e1de1fae5c6bd1-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:18 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=lF%2BZC98%2BAcG4%2BNKR6lQOow%2FJrsCbK7hIT%2B0sKVj0CF1SDPukEmTSSGQkpRdrWUSSlkq2FIJ41AwPx2F%2FWI9ipHzwDUGLGiGOUHX%2FqQOM45Vn30H2Q1NNVNUWgHAJTKbJWVjQWRBNbW0f"}]}
    - cf-ray: a1e1de222a076477-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:19 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=smuV5xC%2BNCRab0yyVfDdWnHxl5ca2DXr7U8JctcpypLidqYvPnKlUq1bU1AOWTYmFOytGhDAO20NI%2FbYBrL1GfDqUwhlZ4Juj0cYkcrGHkKEfW2KE2ZCGUAo20v3Q5MD42SWQ4YGmlhc"}]}
    - cf-ray: a1e1de24ae4546e0-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:19 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=IxyRs8fA0yPRyFMMpR54nlhUrJk3XdJfoIsvOnYzhq0gb13Yzdzuvj2Cog1JGyK%2BpHth0ZY8Llb9x35NEnlM1ggpXEM9C4TsFbo%2BGd8%2BiZl60OAJHCShYuItRlKg%2BDl1aAOzQ7h94YAi"}]}
    - cf-ray: a1e1de272de6eb2f-DFW
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Mon, 20 Jul 2026 12:11:20 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2FO8cgNN8yKGU6idVDgyrgILwN5O2Esk%2F7OpgSHOxbyuZjw8a32HTNA2fRlBSqbSeIXahtZYpFLZg%2B6jD8%2BBdfVUpUARaFzl2Q3h%2Bvu5%2FFN8uI5sDjKqZptCpm4jABxFtLXCNQVjnQHV8"}]}
    - cf-ray: a1e1de2a4aa3accd-DFW
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