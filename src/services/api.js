import request from '../utils/request';

const iport = 'https://www.nangaoyun.com/eiu/ngy';

//扫码鉴权保存用户
export async function usersave(params) {
  return request(iport+'/ngic-eiu/sysEiuUser/save', {
    method: 'POST',
    data: params,
  });
}

//添加设备
export async function addevice(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/save', {
    method: 'POST',
    data: params,
    showToast:true
  });
}

//修改设备名称
export async function changedevicename(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/changeEquipmentName', {
    method: 'POST',
    data: params,
    showToast:true
  });
}

//删除接口
export async function terminatedevice(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/terminate', {
    method: 'POST',
    data: params,
    showToast:true
  });
}


//设备列表
export async function devicelist(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryListByOpenId', {
    method: 'POST',
    data: params,
  });
}
//设备参数
export async function devicedetail(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryEquipmentDetailById', {
    method: 'POST',
    data: params,
  });
}

//设备参数
export async function deviceparams(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryParams', {
    method: 'POST',
    data: params,
  });
}


//设备参数
export async function ratio(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryEquipmentEfficiencyAnalysisById', {
    method: 'POST',
    data: params,
  });
}


//设备参数
export async function history(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryEquipmentHistoryFaultById', {
    method: 'POST',
    data: params,
  });
}

//设备稼动率
export async function jia(params) {
  return request(iport+'/ngic-eiu/umEiuUserEquipment/queryEquipmentUtilizateById', {
    method: 'POST',
    data: params,
  });
}












