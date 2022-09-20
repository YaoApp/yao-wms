function Save(payload) {
  var node_id = Process("models.warehouse.get", {
    limit: 1,
  });
  var data = payload.data.data || [];
  if (!data.length) {
    return {
      code: 400,
      message: "操作失败!",
    };
  }
  if (!node_id.length) {
    return {
      code: 400,
      message: "操作失败!",
    };
  }

  for (var i in data) {
    var par = {};
    par.request_id = randomString(15);
    par.node_id = node_id[0].id;
    var user = Process("models.user.find", data[i]["params"]["user_id"], {});
    if (user.code) {
      continue;
    }
    par.user_sn = user.user_sn;
    par.timestamp = parseInt(Date.now() / 1000);
    var ids = [];
    var rfid = BigInt(data[i]["params"]["code"]).toString(16);
    ids.push({
      rfid: rfid,
      uptime: par.timestamp,
    });
    par.data = ids;
    Process("scripts.event.OnGate", data[i]["params"]["status"], par);
  }

  return {
    code: 200,
    message: "操作成功!",
  };
}

function randomString(len) {
  var $chars =
    "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = "";
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd.toUpperCase();
}
