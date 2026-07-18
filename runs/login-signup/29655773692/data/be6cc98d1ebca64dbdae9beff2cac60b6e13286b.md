# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-signup.spec.ts >> Login & Signup >> login with an existing email but wrong password shows an error
- Location: tests/login-signup.spec.ts:76:7

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
    - date: Sat, 18 Jul 2026 18:25:30 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=s8AMH8c5XpFg0IMAsv%2BYYXcjWrJGGOuUEBj7tYzXETFWCENESxVL4s1HOojBU0JSqN6o78iDzPP30NWXwHZ0Q2ysfjEBGTRp6I1JAiY0DisaylpbCl2mw24mWzkEG6gMe4kfYTL8i4DV"}]}
    - cf-ray: a1d38785de898462-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:30 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2F9eL3WpD%2FHcmtXRUA06TMSl9l%2BJwfKCaNNeSkfWgkF91MopX19aNF8%2B5sAdL2GGHLCOiMNYT7RAp%2BxTF82aXuO7F8OqkwPMx9dE6SqhBmYX0JAsQkU1NAo4VLBv8UB4bzeS%2F5lc2EE5v"}]}
    - cf-ray: a1d387880d3e6798-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:31 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=1L%2BgyZciHisJpp4qQVrKC9xEs5ezeLn7vS0zhuB4etWXCXsc8dd2B%2B730fs10AGdtU0VoiydmDP3usArpJkubbPkOHjH6vvu6VMDcabk3wcGW0gdZcQWG%2B8ayzmq6I0KjYwooqIiSO7j"}]}
    - cf-ray: a1d3878a3f3cf8f3-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:31 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=w%2FjXQhmqi%2FQY%2Bvhx2WoE9XmYOOWfu%2B5BJPXRDelM28jEFYoi8oRFjTa43X%2FgBeYamlJvswCC2sWDeRzQEakPlpw2GoDbPx6aQZxbr7jNyiYYrAzoi7LopTIehpd3zimaNAz3DlfdDgo0"}]}
    - cf-ray: a1d3878c6bdd327e-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:31 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=D8TzyC7j0UPSi5Zws2Wp1JxaIrG6W3MC6WiB6%2F6icu%2BE%2FlpDpdrybqVvz7Co3OI%2Bw1PvryJxOX3wFoUf0ypUaFx%2BZk7SLsJzzU5%2FEJkIvHg1UKx1E45evcXKS4IXiOkkRAQN80KU6UI0"}]}
    - cf-ray: a1d3878eac80ce48-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:32 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=dxMFQBcsuZbZ5ZYHSfWSQFe7q7y416K4DPrNL5r11Q2d%2B3B40MEEWkYEQdZlI6BnPRIun%2BlEWIszUyh8gxx%2Fx5yD49vruGptro%2BaKLVp40jUWhFlFyERJhSxOV4hDGX4Kh5rvtgakoIL"}]}
    - cf-ray: a1d38790da838775-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:32 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=9Al1OyaYoJ6WqJr65p2g4%2BwITZ6VvnvjOvUczk2DVPqPP%2BIesfmOcMPuGLH86xHDGfEt%2FZaHBQpyzEssOBOMRJSQYY9AKlyMiXSb5Qjq6AuRhH2mr6i5tQUIMwplKmlYOGHJ6AEzdnWl"}]}
    - cf-ray: a1d387930dfbf4d9-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:33 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2Bh5%2FDMFM0%2F2bhm%2BswyYl4PawVLW8qvrfTD7cpmaxqZlXtscDW9PcfAn0XJmxeDHvzfkKXCdcO8Yi6oGeF4Lujf7P5w2sO3Yrn%2FSuUpKrKXW1j24DfNtqA6%2BOPTEpmB3vwW%2BdN%2FLcMZsQ"}]}
    - cf-ray: a1d387953a94f9ed-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:33 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=9f1pibv%2BoU7OdIeKvae%2FvmIHxr4Y0MQ5iJqGqtH2yPnvzmO44nmktRzZ2lMWxeLiJ0tekAd%2FGXnJPqnC8Xz7vThL%2BwQMrtM%2BK%2F4RO5iZwpMoH%2BUA0rAfFgH2BZkz758IfqHMv9yXmOlL"}]}
    - cf-ray: a1d387976c63ccb8-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:33 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=u%2FFj%2BlIkzVvkVmDjtMbOF3uJIc9rucQErb7rJNl6m%2BDt8wHSKDlEQPn6RT5wHdGqgf7gl7%2F0mU64LH2g0jr%2FzSN5SRIxMCYzjN7ovQGceZ2HS1VXAlV9Ba8RY0Cw65Q2g%2BDL2SwprDqz"}]}
    - cf-ray: a1d387999dc5ebe4-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:34 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=OhOJuDDZ0z4wipLc2LnQOWYqryA6YFMX5LjCMXlqQHX5V7kOAxhpQAM4QNA34OGp%2B5mm0egqIlpZH3Q7%2F2ijPtEhmNBVHr9JEfj%2BHM1jcMBClycT1Ts8khqAm4FmFrFtS7LRLW905N6l"}]}
    - cf-ray: a1d3879bec4367fc-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:34 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=LbN527iD0XfQam12zkd5OE9IPtixj%2Frx5ANV6MB1CVyjzdpg3ddZaOyoXySpUCA8m4b%2FBWLbWfnQRNFjZura8NfNIb3vkcHYTovIUTaXxB2XSSR4Bf60%2BsU%2Fayvb29l7PzFvXMQ0Sc2p"}]}
    - cf-ray: a1d3879e7f9ceb29-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:34 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=VHRtbWgHa9%2BRgrsM4qRhY3N%2FuFiqVUk6amjZv589g5RyemoNph%2BwKNWRLQNeq1mTe4J4IX7p1KvczxGTKdC%2BL%2B%2FG%2BoSAqdZhMENZcWzuAN56mVDKpQCqMAoOf6u1yGxHNLr1lZsS9r4a"}]}
    - cf-ray: a1d387a0dd17d8a7-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:35 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=FgavToPlnAuJAXcx9H0cqpNu1Z%2FEqRBWX%2FcQFA7E%2Fj807Iz1CEAqTmUXAnj07vcp4pygLoWAeUonXaNhsONKYQ3ESTAbAjIrefSpGsYCruZQdcr%2BJnUnk9bds4K4d3VXKtuUCdZDDZc9"}]}
    - cf-ray: a1d387a30946fa7e-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:35 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=7CdLY%2BpnD5AgVeHp34pn9lXR20OGfOcBXXxP8A%2BWdo0StjDHxJRLT33iK4g65k3IC30RaZrAZnN4jd%2B62k9%2F7%2B97tYloGisOddPshk8ZwKDXaW7rq%2BV7urjornlQa1iQRoh4%2BMLwZ9mD"}]}
    - cf-ray: a1d387a52f54cd36-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:35 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=ekI%2Be9P%2B%2FE4An9sjLurbVsvodRKJV%2FTKKsh22MoDaRhUNOdQSmqrY6aYy6Mp5fgwMYAtS32DPBMmmtR8DkiW4f1mzD1y0kx81FH%2BeYABUnkdvviZEOIvbVsy6pl0O2Dc100c5UPLoYtX"}]}
    - cf-ray: a1d387a75b730b82-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:36 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=psiO%2BsbU1VqN2E3xbe7J4BrjA6v0uswZedsXvi4zG%2FfO551fSR0ljVns9Hu%2FdKtD40LcYyucJrgxysNIFqehILOiX36nM3Wev8M2Jae6PYbX58j7bnFBZ4AmEVCB4Ju9l644DCp6UA8T"}]}
    - cf-ray: a1d387a97b7f8462-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:36 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=wv40Si6VQUCqbFgY8w8bDQKYGr1aWIj2F64Z%2FUUiFxeX8i29OcU6kpXAwQvyotJxd9EDc2KUmaFDteIUaWbQl9KpwcvWR2WPJnPAQSMvL0sUrItBgrGam5GFxIljTWm%2B4AVJVOEkCG%2Ba"}]}
    - cf-ray: a1d387ab99e46798-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:36 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=4IMmmWlUYfA2q4ZjdhFJCeBojZZ6UaM%2FTkDUUtM5X06r2S%2BM09G%2FWY6JUnxhtI%2FuYeTXWW77F7NLhqqut2gLMU%2B6raFKAkUnYQj6TIeoecZMvzKBdcEqGSR8tVUsfrsF2X9q6ewusNKy"}]}
    - cf-ray: a1d387adcb6f6ad1-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:37 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=lgS8RVHn65ey4XaBn%2BMod9ZI%2Bn3%2BgnH%2BBeGwTwZJZERrD%2F4UTnJ18QeF3uFOsPS6fiPAQWWFNj6mz7sdqNxAcZF%2FQ1tikJ9lzoYpE%2F28ihE7Z66UvQ70KPuwvXmZ5kYgqZOhIkfn%2Bg62"}]}
    - cf-ray: a1d387afea2af8f3-SJC
    - alt-svc: h3=":443"; ma=86400
  - → GET https://automationexercise.com/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
  - ← 302 Found
    - date: Sat, 18 Jul 2026 18:25:37 GMT
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
    - report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=WBoZm%2F6EgCUF5%2Fd2hC76XhCeBPEqK0g9e3U81qv0%2FwO7yd%2FKCpEAACwmvKlps0S%2FfaWgGhlfZetg8rPXdv8Rv8JDKKgw2jokdCBLYXQQKDU2lZsH2AAdk0bkrPwa%2FY98hYJxM9r2Mvly"}]}
    - cf-ray: a1d387b21a48cff5-SJC
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