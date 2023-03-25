사용하던대로 https 통신하면 됨

```
npm start
```

# /pdf 전송 방법

formData 에 값을 넣어서 보내야함
키 값을 frm로 맞춰야 받아지게 되있음 ( 단일 파일용 )

```js
formData.append('frm', file as File, encodeURIComponent(file.name))
```

파일은 uploads 에 저장됨

# 출처

패캠 강의 중 받은 배포 서버를 개조해서 사용함
feat. 안재원 강사님
