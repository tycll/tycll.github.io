var lun = new Lunar(); //����ȫ�ֶ���
var curJD; //��������
var curTZ; //��ǰʱ��

function showHXK0(){ //��ʾ���ǿ���������
 var i,n,c;
 for(i=0;i<HXK.length;i++){
  n = HXK[i].indexOf('#');
  addOp(document.all.Cf_xk,i,HXK[i].substr(0,n));
 }
 for(i=0;i<xz88.length;i+=5){
  addOp(document.all.Cf_xk, i+1000, xz88[i].substr(0,3));
 }
}
function showHXK(ind){ //��ʾ���ǿ�
 ind -= 0;
 var bt='   RA(ʱ����)   DEC(�ȷ���)   ����1  ����2  �Ӳ�  �ǵ�  ����  ����', r='';
 if(ind<100){
  r = HXK[ind];
  var n = r.indexOf('#');
  r = r.substr(n, r.length-n); //ȥ����һ��
 }
 else if(ind>=1000){
  r = schHXK( xz88[ind-1000].substr(3,3) );
 }
 Cf_db.innerText = bt + r.replace(/\#/g,'\r\n');
}
showHXK0();
showHXK(0);
function aCalc(){ //���Ǽ���
 var jd = JD.JD( year2Ayear(Cf_y.value), Cf_m.value-0, (Cf_d.value-0)+timeStr2hour(Cf_t.value)/24 ) - J2000;  //ȡ��Ļʱ��
 if(Cf_ut.checked) jd += curTZ/24+dt_T(jd); //תΪ��ѧʱ

 var dt = Cf_dt.value-0, n = Cf_n.value-0;
 var Q  = Cf_nsn.checked ? 35 : 0;                     //С��35��ĳƶ�������
 var lx = Cf_lx.options[Cf_lx.selectedIndex].value-0;  //��������
 var L  = Cf_J.value/180*Math.PI; //�ر�
 var fa = Cf_W.value/180*Math.PI;

 var i,s = '', F = getHXK(Cf_db.innerText,0);
 for(i=0; i<n; i++, jd+=dt)
   s += hxCalc(jd/36525,F,Q, lx, L,fa);
 Cf_xl.innerText = s;
}


function txFormatT(t){ //����ʱ���ʽ�����
  var t1 = t*36525 + J2000;
  var t2 = t1  - dt_T(t1-J2000) - curTZ/24;
  return JD.JD2str(t1) +' TD '
       + JD.JD2str(t2).substr(9,11) +' UT ';
}
function tianXiang(xm,xm2){
 var jd = JD.JD( year2Ayear(Ce_y.value), Ce_m.value-0, (Ce_d.value-0) ) - J2000;  //ȡ��Ļʱ��
 var n=Ce_n.value-0;
 var s='',i,re;
 jd /= 36525;

 if(xm==1||xm==2){ //��������Զ��
  for(i=0;i<n;i++,jd=re[0]+27.555/36525){
   if(xm==1) re=XL.moonMinR(jd,1); //�����
   if(xm==2) re=XL.moonMinR(jd,0); //��Զ��
   s += txFormatT(re[0]) + re[1].toFixed(2)+'ǧ��\r\n';
  }
 }
 if(xm==3||xm==4){ //��������������
  for(i=0;i<n;i++,jd=re[0]+27.555/36525){
   if(xm==3) re=XL.moonNode(jd,1); //����
   if(xm==4) re=XL.moonNode(jd,0); //��
   s += txFormatT(re[0]) + rad2str(rad2mrad(re[1]),0)+'\r\n';
  }
 }
 if(xm==5||xm==6){ //������Զ��
  for(i=0;i<n;i++,jd=re[0]+365.259636/36525){
   if(xm==5) re=XL.earthMinR(jd,1); //�����
   if(xm==6) re=XL.earthMinR(jd,0); //��Զ��
   s += txFormatT(re[0]) + re[1].toFixed(8)+' AU\r\n';
  }
 }
 if(xm==7||xm==8){ //������
  for(i=0;i<n;i++,jd=re[0]+115.8774777586/36525){
   if(xm==7) re=daJu(1,jd,1); //��ˮ�Ƕ����
   if(xm==8) re=daJu(1,jd,0); //��ˮ�Ƕ�����
   s += txFormatT(re[0]) + (re[1]/Math.PI*180).toFixed(5)+'��\r\n';
  }
 }
 if(xm==9||xm==10){ //������
  for(i=0;i<n;i++,jd=re[0]+583.9213708245/36525){
   if(xm==9) re=daJu(2,jd,1); //��ˮ�Ƕ����
   if(xm==10)re=daJu(2,jd,0); //��ˮ�Ƕ�����
   s += txFormatT(re[0]) + (re[1]/Math.PI*180).toFixed(5)+'��\r\n';
  }
 }
 if(xm==11){ //���¼���
  s = '����ʱ��(TD UT) ���³�γ��(С��1�ȿ���������,���Ӳ����)\r\n';
  for(i=0;i<n;i++,jd=re[0]+28/36525){
   re = xingHY(xm2,jd);
   s += txFormatT(re[0]) + (-re[1]/Math.PI*180).toFixed(5)+'��\r\n';
  }
 }

 if(xm==12||xm==13){
  if(xm==12) s = xxName[xm2]+'����(���������Ϻ�)\r\n';
  if(xm==13) s = xxName[xm2]+'����(���������º�)\r\n';
  s +='�ƾ���/����ʱ��(TD UT) ���ճ�γ��\r\n';
  for(i=0;i<n;i++,jd=re[0]+cs_xxHH[xm2-1]/36525){
   if(xm==12) re = xingHR(xm2,jd,0);
   if(xm==13) re = xingHR(xm2,jd,1);
   s += txFormatT(re[0]) + (-re[1]/Math.PI*180).toFixed(5)+'��\r\n';
  }
 }
 if(xm==14||xm==15){ //˳��
  if(xm==14) s = xxName[xm2]+'˳��\r\n';
  if(xm==15) s = xxName[xm2]+'����\r\n';
  s +='��ʱ��(TD UT)\r\n';
  for(i=0;i<n;i++,jd=re+cs_xxHH[xm2-1]/36525){
   if(xm==14) re = xingLiu(xm2,jd,1);
   if(xm==15) re = xingLiu(xm2,jd,0);
   s += txFormatT(re)+'\r\n';
  }
 }
 Ce_tab.innerText=s;
}

function pCalc(xm){ //������������
 var jd = JD.JD( year2Ayear(Cd_y.value), Cd_m.value-0, (Cd_d.value-0)+timeStr2hour(Cd_t.value)/24 ) - J2000;  //ȡ��Ļʱ��
 if(Cd_ut.checked) jd += curTZ/24+dt_T(jd); //תΪ��ѧʱ
 var xt = Cd_xt.options[Cd_xt.selectedIndex].value;
 var dt = Cd_dt.value-0, n = Cd_n.value-0;
 var L  = Cd_J.value/180*Math.PI; //�ر�
 var fa = Cd_W.value/180*Math.PI;
 if(n>1000) {alert("����̫����"); return;}
 var s='',i;
 //������
 for(i=0;i<n;i++,jd+=dt){
   var jd2=jd+2451545;
   s += JD.JD2str(jd2)+'TD, JED = '+jd2.toFixed(7)+' '+'\r\n';
   s += xingX(xt,jd,L,fa)+'\r\n';
 }
 Cd_tab.innerText=s;
}

//=============����ʳͼ��===========
function zb_calc(){ //��ʱ�������
  if(Cal_pause.checked) return;

  var now = new Date();
  var jd = now/86400000-10957.5; //J2000�������������
  jd += dt_T(jd);
  msc.calc(jd, Cb_J.value/radd, Cb_W.value/radd,0); //������ѧʱ��(J2000.0����)
  Cal_zb.innerHTML = msc.toHTML(0);
}

function zxsCopy(J,W){ //����ĳʱ������ʳ�ر꣬������ô���ʳ
  Cb_J.value=J;
  Cb_W.value=W;
  tu_calc(2);
}
function tu_calc(ly){ //ly��ȡʱ��ķ�ʽ,xm�Ǽ������Ŀ
 tu1.init(Can1); //������ʼ��
 var jd; //J2000�������������(����ʱ��)
 var vJ = Cb_J.value/radd;
 var vW = Cb_W.value/radd;
 //ȡʱ��
 jd = JD.JD( year2Ayear(Cb_y.value), Cb_m.value-0, (Cb_d.value-0)+timeStr2hour(Cb_t.value)/24 ) - J2000;  //ȡ��Ļʱ��
 if(ly==0) jd = (new Date())/86400000-10957.5-curTZ/24, Cb_ut.checked=true; //ȡ����ʱ��(UTC)
 if(ly==1) jd -= Cb_step.value/86400;
 if(ly==2); //����ȡʱ��
 if(ly==3) jd += Cb_step.value/86400;

 if(ly==4) jd -=29.53;
 if(ly==5) ;
 if(ly==6) jd +=29.53;
 if(ly==7) jd -=29.53;
 if(ly==8) ;
 if(ly==9) jd +=29.53;

 if(ly==4||ly==5||ly==6) jd = XL.MS_aLon_t2( Math.floor((jd+8)/29.5306)*pi2 )*36525;
 if(ly==7||ly==8||ly==9) jd = XL.MS_aLon_t2( Math.floor((jd-4)/29.5306)*pi2+Math.PI )*36525;
 if(ly>=4&&ly<=9){
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd);
 }

 //��ʱ��
 var ts=JD.JD2str(jd+J2000);
 Cb_y.value = ts.substr(0,5)-0;
 Cb_m.value = ts.substr(6,2);
 Cb_d.value = ts.substr(9,2);
 Cb_t.value = ts.substr(12,8);

 if(Cb_ut.checked) jd += curTZ/24+dt_T(jd); //תΪ��ѧʱ
 var i;


 var sn = int2( (jd-6)/29.53058885*2+0.5 ) + 100000000; //���»���,������ʳ��ǩ
 var sn2 = sn+' '+vJ+' '+vW+Cb_nasa.checked+Cb_ut.checked; //ĳ����ʳ��ǩ

 msc.calc(jd,vJ,vW,Cb_high.value-0);
 Cal_zb.innerHTML=msc.toHTML(1); //��ʾ����

 if(Cb_sjzb.checked){
  tu1.move4(tu1.sun, msc.sCJ,msc.sCW, msc.gst);
  tu1.move4(tu1.moon,msc.mCJ,msc.mCW, msc.gst);
 }else{
  tu1.move(tu1.sun, msc.sPJ,msc.sPW, Cb_bei.checked);
  tu1.move(tu1.moon,msc.mPJ,msc.mPW, Cb_bei.checked);
 }

 var msHJ = rad2mrad(msc.mHJ-msc.sHJ);
 var s='',J1,W1,J2,W2,  sr,mr,er,Er,d0,d1,d2;

 if(msHJ<3/radd || msHJ>357/radd){ //��ʳͼ��Ŵ����
  J1=msc.mCJ2,W1=msc.mCW2, J2=msc.sCJ2, W2=msc.sCW2;  //��δ�������������������ʳ
  sr=msc.sRad, mr=msc.mRad;
  d1=j1_j2(J1,W1,J2,W2)*rad,d0=mr+sr;
  tu1.move2a(J1,W1,J2,W2,mr,sr);
  tu1.move3(msc.zx_J,msc.zx_W,Cb_phSave.checked);
  s2 = '�˿�������Ӱ�����߲���������';
  if(msc.zx_W!=100){
    var zxsJ=(msc.zx_J/Math.PI*180).toFixed(5);
    var zxsW=(msc.zx_W/Math.PI*180).toFixed(5);
    s2 = 'ʳ���ĵر꣺�� '+ zxsJ  +' γ '+ zxsW
       +' <a href="javascript:zxsCopy('+zxsJ+','+zxsW+')">�˵�</a>';
  }

  s = '����վ���Ӱ뾶 '+m2fm(sr,2,0)+'��'+m2fm(mr,2,0)+' <font color=red>'+s2+'</font><br>'
    + '���������Ӿ� '+m2fm( d1,2,0 ) +' ���°뾶�� '+m2fm(d0,2,0) + ' �뾶�� ' + m2fm(sr-mr,2,0) +' ������ '+m2fm(d1-d0,2,0);
  Cb_zb.innerHTML = s;

  //��ʾ�ϱ�������
  rsPL.nasa_r=0; if(Cb_nasa.checked) rsPL.nasa_r=1; //�Ӿ�ѡ��
  s=JD.JD2str(jd+J2000)+' TD<br>�ϱ���㣺���ȡ�������γ��<br>',mc=new Array('ʳ���ĵ�','��Ӱ����','��Ӱ�Ͻ�','��Ӱ����','��Ӱ�Ͻ�');
  rsPL.nbj(jd);
  for(i=0;i<5;i++){
    s += mc[i]+'��';
    if(rsPL.V[i*2+1]==100) { s += '�ޡ�����������<br>'; continue; }
    s += (rsPL.V[i*2]*radd).toFixed(5)+'��'+(rsPL.V[i*2+1]*radd).toFixed(5)+'<br>';
  }
  s += '�������ͣ�'+rsPL.Vc+'ʳ<br>';
  s += '��Ӱ�ϱ����Լ'+rsPL.Vb;
  Cb_b1.innerHTML = s;

  //��ʾʳ����ʱ��
  if(Cb_b2.sn&&Cb_b2.sn==sn2) return;//��ʳ��������Ѽ���

  rsPL.nasa_r=0; if(Cb_nasa.checked) rsPL.nasa_r=1; //�Ӿ�ѡ��
  var td=' TD',mc=new Array('����','ʳ��','��Բ','ʳ��','����');
  rsPL.secMax(jd, vJ,vW, Cb_high.value-0);
  if(rsPL.LX=='��') mc[3]='��ʳʼ',mc[4]='��ʳ��'; //��ʳû��ʳ�Ⱥ�����
  var s='ʱ��� (��'+rsPL.LX+'ʳ)<br>'
  for(i=0;i<5;i++){
   jd=rsPL.sT[i]; if(!jd) continue;
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd),td=' UTC'; //תΪUTC(����ʱ��)
   s+=mc[i]+':'+JD.JD2str(jd+J2000)+td+'<br>';
  }
  s+='ʱ��: '+m2fm(rsPL.dur*86400,1,1)+'<br>';
  s+='ʳ��: '+rsPL.sf.toFixed(5)+'<br>';
  s+='�����Ӿ���: '+rsPL.b1.toFixed(5)+'(ȫ��ʳ��)<br>';
  s+='�Ƿ�NASA����(1��,0��): '+rsPL.nasa_r+'<br>';
  s+='ʳ��ָ����ֱ�����ڱ���';
  Cb_b2.innerHTML = s;
  Cb_b2.sn = sn2;
  return;
 }
 if(msHJ>170/radd && msHJ<190/radd){ //��ʳͼ��Ŵ����
  J1=msc.mCJ,W1=msc.mCW, J2=msc.sCJ+Math.PI, W2=-msc.sCW;
  er=msc.eShadow, Er=msc.eShadow2, mr=msc.e_mRad; //��δ�������������������ʳ
  d1=j1_j2(J1,W1,J2,W2)*rad, d0=mr+er,d2=mr+Er;
  tu1.move2b(J1,W1,J2,W2, mr,er,Er);
  s= '��Ӱ�뾶 '+m2fm(er,2,0)+' ��Ӱ�뾶 '+m2fm(Er,2,0)+' ���������Ӱ뾶 '+m2fm(mr,2,0)+'<br>'
    + 'Ӱ�����ľ� '+m2fm( d1,2,0 ) +' Ӱ�°뾶�� '+m2fm(d0,2,0) +' ������ <font color=red>'+m2fm(d1-d0,2,0) +'</font> ��ڶ����� '+m2fm(d1-d2,2,0) ;
  Cb_zb.innerHTML = s;

  if(Cb_b2.sn&&Cb_b2.sn==sn) return; //�Ѿ���ʾ��ʳ������Ƚ��
  var td=' TD',mc=new Array('����','ʳ��','��Բ','��Ӱʳʼ','��Ӱʳ��','ʳ��','����');
  ysPL.lecMax(jd);
  var s='ʱ���(��'+ysPL.LX+'ʳ)<br>';
  for(i=0;i<7;i++){
   jd=ysPL.lT[i]; if(!jd) continue;
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd),td=' UTC'; //תΪUTC(����ʱ��)
   s+=mc[i]+':'+JD.JD2str(jd+J2000)+td+'<br>';
  }
  s+='ʳ��:'+ysPL.sf.toFixed(5)+'<br>';
  s+='ʳ��ָ����ֱ�����ڱ���';
  Cb_b2.innerHTML = s;
  Cb_b1.innerHTML = '';
  Cb_b2.sn = sn;
  return;
 }
 tu1.ecShow(0,0,0,0);
 Cb_zb.innerHTML = Cb_b1.innerHTML = Cb_b2.innerHTML = '';
 Cb_b2.sn = 0;

}
function tu_cls_path(){
  tu1.init(Can1);
  tu1.mark.p_cls();
  tu1.mark.p_save();
}

//==================��ʳ����ͼ=================
function tu2_jxb(){ //��ʾ���߱�
 var jd = Cp10_jd.value-J2000; //ȡ��Ļʱ��
 jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //��˷
 rsGS.init(jd,7);
 Cp10_tz.innerHTML=rsGS.jieX3(jd);
}

function tu2_xx(jd){ //ת����ϸ��ʳͼ��ҳ��
 //��ʱ��
 var ts=JD.JD2str(jd+J2000);
 Cb_y.value = ts.substr(0,5)-0;
 Cb_m.value = ts.substr(6,2);
 Cb_d.value = ts.substr(9,2);
 Cb_t.value = ts.substr(12,8);
 Cb_ut.checked = false;
 showPage(3);
}
function tuGL_search(fs){ //������ʳ
  var i,k,r,s='',s2='', n=Cp10_an.value-0;
  var jd = JD.JD( year2Ayear(Cp10_y.value), Cp10_m.value-0, 0) - J2000;  //ȡ��Ļʱ��
  jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //��˷
  for(i=0,k=0;i<n;i++){
   r=ecFast(jd); //�;��ȸ�������
   if(r.lx=='NN') { jd += 29.5306; continue; } //�ų������ܵ���������ټ���
   if(!r.ac){
     if(fs==0) rsGS.init(jd, 2); //�;���
     if(fs==1) rsGS.init(jd, 7); //�߾���
     r = rsGS.feature(jd);
   }
   if(r.lx!='N'){
    s += '<a href="javascript:tu2_calc(1,'+r.jd+');">'+JD.JD2str(r.jd+J2000).substr(0,11)+'</a>';
    s += r.lx;
    k++;
    if(k%10==0) s+='<br>';
    if(k%100==0) s2+=s, s='';
   }
   jd = r.jd+29.5306;
  }
  Cp10_b1.innerHTML = s2+s;
}

var tu3_buff=0;
function tu2_calc(fs,jd0){
 tu2.init(Can2);
 if(fs==0) return;

 var step = Cp10_step.value-0;
 var jd = Cp10_jd.value-J2000; //ȡ��Ļʱ��
 if(fs==1) jd = jd0;
 if(fs==2) ; //����ʱ�䲻��
 if(fs==3) jd -= step;
 if(fs==4) jd += step;
 jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //��˷
 Cp10_jd.value = Cp10_jd2.value = (jd+J2000).toFixed(6);    //��������Ļ��
 Cp10_jdstr.innerHTML=JD.JD2str(jd+J2000); //��ʾʱ�䴮


 //���㵥����ʳ
 if(fs==1||fs==2||fs==3||fs==4){

  rsGS.init(jd,7);
  var r = rsGS.feature(jd); //��������
  var lxb={T:'ȫʳ',A:'��ʳ',P:'ƫʳ',T0:'������ȫʳ',T1:'���ֱ�Ӱ������ȫʳ',A0:'�����Ļ�ʳ',A1:'����α��Ӱ������ȫʳ',H:'ȫ��ȫ',H2:'ȫȫ��',H3:'��ȫȫ'};
  if(r.lx=='N') Cp10_tz.innerHTML='����ʳ';
  else Cp10_tz.innerHTML = '<table><tr>'
   + '<td class=dRB><b>������ʳ����(��ѧʱ)</b><br>'

   + 'ƫʳʼ��'+JD.JD2str(r.gk3[2]+J2000)+' '+rad2str2(r.gk3[0])+','+rad2str2(r.gk3[1])+'<br>'
   + '����ʼ��'+JD.JD2str(r.gk1[2]+J2000)+' '+rad2str2(r.gk1[0])+','+rad2str2(r.gk1[1])+'<br>'
   + (r.gk5[1]!=100 ?
     '����ʳ��'+JD.JD2str(r.gk5[2]+J2000)+' '+rad2str2(r.gk5[0])+','+rad2str2(r.gk5[1])+'<br>' : '')
   + '�����գ�'+JD.JD2str(r.gk2[2]+J2000)+' '+rad2str2(r.gk2[0])+','+rad2str2(r.gk2[1])+'<br>'
   + 'ƫʳ�գ�'+JD.JD2str(r.gk4[2]+J2000)+' '+rad2str2(r.gk4[0])+','+rad2str2(r.gk4[1])+'</td>'

   + '<td class=dRB><b>���ĵ�����</b><br>'
   + 'Ӱ����ľ� �� = '+r.D.toFixed(4)+'<br>'
   + '���ĵر� (��,γ) = ' + (r.zxJ*radd).toFixed(2)    + ',' + (r.zxW*radd).toFixed(2)    + '<br>'
   + '����ʱ�� tm = '+JD.JD2str(r.jd+J2000)+'<br>'
   + '̫����λ (��,γ) = ' + (r.Sdp[0]*radd).toFixed(0) + ',' + (r.Sdp[1]*radd).toFixed(0) + '<br>'
   + '��ʳ���� LX = '+r.lx+' '+lxb[r.lx]+'<br>'
   + 'ʳ��='+r.sf.toFixed(4)+', ʳ��='+m2fm(r.tt*86400,0,2)+', ʳ��='+r.dw.toFixed(0)+'km<br>'
   + '</td>'
   + '</tr></table>';

  if(Cp10_showJX.checked){
    Can2.style.display='none';
    Can3.style.display='block';
    tu3.init(Can3);
    tu3_buff=rsGS.jieX(jd); //ȡ����
    var J0=(tu3_buff.zxJ*radd).toFixed(0);
    var W0=(tu3_buff.zxW*radd).toFixed(0);
    Cp10_J0.value = J0;
    Cp10_W0.value = W0;
    var jb=[Cp10_x0.value/10, Cp10_y0.value/10, Cp10_dx.value/10, Cp10_dy.value/10];
    tu3.draw(tu3_buff, J0/radd, W0/radd, Cp10_eR.value-0, jb, Cp10_tylx.options.selectedIndex);
  }else{
    Can2.style.display='block';
    //Can3.style.display='none';
    tu2.line1(r,Cp10_hc.checked);
  }
  return;
 }

 //��������ʳ
 if(fs==5){
  Can2.style.display='block';
  Can3.style.display='none';
  var i,r, bn = Cp10_bn.value-0; //������Ϊ�ಽ
  var s = '<table border="0" width="100%" cellpadding="0" cellspacing="0">'
        + '<tr align=center bgcolor="#EEFFEE"><td>��ѧʱ</td><td>��</td><td>��</td><td>���ĵر�</td><td>��λ��</td><td>ʳ��</td><td>ʳ��</td><td>ʳ��</td><td>���</td></tr>';
  for(i=0;i<bn;i++,jd+=step){
   rsGS.init(jd,3);  //�о��ȼ���
   r = rsGS.feature(jd);
   if(r.lx=='N') continue;
   s += '<tr align=center><td>'
     + JD.JD2str(r.jd+J2000) + '</td><td>' + r.D.toFixed(4) + '</td><td>' + r.lx + '</td><td>'
     + (r.zxJ*radd).toFixed(2)    + ',' + (r.zxW*radd).toFixed(2)    + '</td><td>'
     + (r.Sdp[0]*radd).toFixed(0) + ',' + (r.Sdp[1]*radd).toFixed(0) + '</td><td>'
     + r.sf.toFixed(4) + '</td><td>' + r.dw.toFixed(0) + '</td><td>' + m2fm(r.tt*86400,0,2) + '</td><td>'
     + '<a href="javascript:tu2_xx('+r.jd+');">��ϸ</a>'+ '</td><td>'
     + '</td></tr>';
   tu2.line1(r,Cp10_hc.checked);
  }
  s += '</table>';
  Cp10_tz.innerHTML = s;
 }

}

function tu3_xz(xm){ //��תͼ3
 if(!tu3_buff) { alert('��ѡ�ʳ�硱���ϲ�����'); return; }
 tu3.init(Can3);
 var J0=Cp10_J0.value-0, W0=Cp10_W0.value-0;
 if(xm==0) J0 += 15;
 if(xm==1) J0 -= 15;
 if(xm==2) W0 += 15;
 if(xm==3) W0 -= 15;
 if(xm==4); //���ֲ���
 Cp10_J0.value = J0, Cp10_W0.value = W0;
 var jb=[Cp10_x0.value/10, Cp10_y0.value/10, Cp10_dx.value/10, Cp10_dy.value/10];
 tu3.draw(tu3_buff, J0/radd, W0/radd, Cp10_eR.value-0, jb, Cp10_tylx.options.selectedIndex);
}

function tu3_yingzi(xm){ //��ʾӰ��
 var jd = Cp10_jd2.value-J2000; //ȡ��Ļʱ��
 if(xm==1) jd -= Cp10_step2.value/86400;
 if(xm==2) jd += Cp10_step2.value/86400;
 Cp10_jd2.value = (jd+J2000).toFixed(4);

 rsGS.init(jd,7);
 var r=rsGS.jieX2(jd);
 tu3.draw2(r);
}

function dfRS(ly){ //�ط���ʳ������
 var jd = JD.JD( year2Ayear(Cc_y.value), Cc_m.value-0, (Cc_d.value-0) ) - J2000;  //ȡ��Ļʱ��
 if(ly==1) jd -=29.53;
 if(ly==2) jd +=29.53;
 jd = XL.MS_aLon_t2( Math.floor((jd+8)/29.5306)*pi2 )*36525;

 //��ʱ��
 var ts=JD.JD2str(jd+J2000-curTZ/24-dt_T(jd));
 Cc_y.value = ts.substr(0,5)-0;
 Cc_m.value = ts.substr(6,2);
 Cc_d.value = ts.substr(9,2);

 rsPL.nasa_r=0; if(Cc_nasa.checked) rsPL.nasa_r=1; //�Ӿ�ѡ��
 var i,j,t,c, ou='����	ʳ��	����	ʳ��	��Բ	ʳ��	����	�ճ�	����	P1,V1	P2,V2\r\n', s=Cc_db.innerText;
 s=s.replace(/\r\n/g,'#'); s=s.replace(/ /g,''); s=s.split('#');
 for(i=0;i<s.length;i++){
  c=s[i];         if(c.length==0||c.substr(0,1)=='*') continue;
  c=c.split(','); if(c.length<=3) continue;
  c[2]/=radd, c[1]/=radd; //��γ��
  rsPL.secMax(jd,c[2],c[1],c[3]/1000); //��ʳ����
  ou += c[0]+'['+rsPL.LX+']';
  ou += '	'+rsPL.sf.toFixed(5); //ʳ��
  for(j=0;j<5;j++){
   t  = rsPL.sT[j]; if(!t) {ou+='	--:--:--'; continue;}
   t = t -curTZ/24 -dt_T(t) +J2000; //תΪUTC(����ʱ��)
   ou+='	'+JD.JD2str(t).substr(12,8);
  }
  if(rsPL.sf){
   ou += '	'+JD.timeStr(rsPL.sun_s -curTZ/24+J2000);
   ou += '	'+JD.timeStr(rsPL.sun_j -curTZ/24+J2000);
   ou += '	'+(rsPL.P1*radd).toFixed(0)+','+(rsPL.V1*radd).toFixed(0);
   ou += '	'+(rsPL.P2*radd).toFixed(0)+','+(rsPL.V2*radd).toFixed(0);
  }
  ou += '\r\n';
 }
 Cc_tb.innerText=ou;
}

//====================������===================
function shengjiang(){
  SZJ.L  = Cp9_J.value/radd; //����վ�����
  SZJ.fa = Cp9_W.value/radd;
  var jd = JD.JD( year2Ayear(Cp9_y.value), Cp9_m.value-0, (Cp9_d.value-0)+0.5 ) - J2000;  //ȡ��Ļʱ��
  var sq = SZJ.L/pi2*24;

  var s="<font color=red>����ʱ��(תΪ��������ʱ�����8Сʱ)��</font><br>", r, c=J2000+8/24;

  r=SZJ.St(jd-sq/24);
  s +="̫������ " + JD.JD2str(r.s+c) + " ̫������ " + JD.JD2str(r.j+c)+"<br>";
  s +="�������� " + JD.JD2str(r.z+c) + " �������� " + JD.JD2str(r.x+c)+"<br>";
  s +="�������� " + JD.JD2str(r.c+c) + " ������� " + JD.JD2str(r.h+c)+"<br>";
  s +="�������� " + JD.JD2str(r.c2+c)+ " ������� " + JD.JD2str(r.h2+c)+"<br>";
  s +="�������� " + JD.JD2str(r.c3+c)+ " ������� " + JD.JD2str(r.h3+c)+"<br>";
  s +="���ճ��� " + JD.timeStr(r.j-r.s-0.5) + " �չⳤ�� " + JD.timeStr(r.h-r.c-0.5) + "<br>";
  if(r.sm) s += 'ע��'+r.sm+'<br>';
  r=SZJ.Mt(jd-sq/24);
  s +="�������� " + JD.JD2str(r.s+c) + " �������� " + JD.JD2str(r.j+c)+"<br>";
  s +="�������� " + JD.JD2str(r.z+c) + " �������� " + JD.JD2str(r.x+c)+"<br>";
  Cp9_out.innerHTML=s;
}
function shengjiang2(){ //̫����������
  var L  = Cp9_J.value/radd; //����վ�����
  var fa = Cp9_W.value/radd;
  var jd = JD.JD( year2Ayear(Cp9_y.value), 1, 1.5 ) - J2000;  //ȡ��Ļʱ��
  var i,t, s='',s2='';
  for(i=0;i<368;i++){
    t=sunShengJ(jd+i,L,fa,-1)+J2000+8/24; s2+='<font color=red>'+JD.JD2str(t).substr(6,14)+'</font>��';
    t=sunShengJ(jd+i,L,fa, 1)+J2000+8/24; s2+=JD.timeStr(t)+'<br>';
    if(i== 91||i==275) s+='<td>'+s2+'<td>', s2='';
    if(i==183||i==367) s+='<td>'+s2+'<td>', s2='';
  }
  Cp9_out.innerHTML='<center><b>̫�����������</b><table><tr>'+s+s2+'</tr></table></center>';
}
function shengjiang3(){ //���ʱ��
  var jd = JD.JD( year2Ayear(Cp9_y.value), 1, 1.5 );  //ȡ��Ļʱ��
  var i,t,D, s='',s2='';
  for(i=0;i<368;i++){
    D=jd+i-8/24-J2000, D+=dt_T(D);
    t=pty_zty(D/36525); s2+=JD.JD2str(jd+i).substr(0,11)+' <font color=red>'+m2fm(t*86400,2,2)+'</font><br>';
    if(i== 91||i==275) s+='<td>'+s2+'<td>', s2='';
    if(i==183||i==367) s+='<td>'+s2+'<td>', s2='';
  }
  Cp9_out.innerHTML='<center><b>̫��ʱ���(����ʱ��Ϊ����ʱ��ÿ��12��)<br</b><table><tr>'+s+s2+'</tr></table></center>';
}

//====================��˷��===================
function suoCalc(jiao){ //��˷���Ժ���
 if(jiao==-1) jiao=prompt("������Ƕ�(0˷,90����,180��,270����,������):",0)-0;
 var i,r,T,s = "��-�ջƾ���"+jiao+"<br>", s2="";
 var y = year2Ayear(Cp8_y.value)-2000;
 var n = Cp8_n.value-0;
 var n0 = int2(y*(365.2422/29.53058886)); //��ֹ�����׾���˷���ĸ���
 for(i=0;i<n;i++){
  T = XL.MS_aLon_t( (n0+i+jiao/360)*2*Math.PI );  //��ȷʱ�����,��ڲ����ǵ����˷���ƾ�
  r = XL1_calc(2,T,-1); //��������
  s2 += JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) )+' '+r.toFixed(2)+"ǧ��<br>";   //����תΪ�ִ�
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}
function qiCalc(){ //�������Ժ���
 var i,T,s="",s2="";
 var y=year2Ayear(Cp8_y.value)-2000;
 var n=Cp8_n.value-0;
 for(i=0;i<n;i++){
  T = XL.S_aLon_t( (y+i*15/360+1)*2*Math.PI );    //��ȷ����ʱ�����
  s2+=JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) )+obb.jqmc[(i+6)%24];  //����תΪ�ִ�
  if(i%2==1) s2+=' �ӻƾ�'+(i*15)+'<br>'; else s2+='��'
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}

function houCalc(){ //������Ժ���
 var i, T, s='���򡡡������������������������򡡡�������������������', s2='';
 var y=year2Ayear(Cp8_y.value)-2000;
 var n=Cp8_n.value-0;
 for(i=0;i<n*3;i++){
  T = XL.S_aLon_t( (y+i*5/360+1)*2*Math.PI );    //��ȷ����ʱ�����
  if(i%3==0) s2+='<br>'+obb.jqmc[(i/3+6)%24]; else s2+='��';
  s2+=JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) );  //����תΪ�ִ�
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}


//==========================
//ҳ�������йصĺ���
//==========================
function showPage(pg){
  showHelp(0); //�رտ����Ѵ򿪵İ���ҳ��
  Cal_pause.checked=true;
  page1.style.display='none';
  page2.style.display='none';
  page3.style.display='none';
  page4.style.display='none';
  page5.style.display='none';
  page6.style.display='none';
  page7.style.display='none';
  page8.style.display='none';
  page9.style.display='none';
  page10.style.display='none';
  page11.style.display='none';
  page12.style.display='none';
  page13.style.display='none';
  if(pg==1) page1.style.display='block';
  if(pg==2){page2.style.display='block'; getNianLi(0);} //����
  if(pg==3){page3.style.display='block'; tu_calc(2);} //ͼ��
  if(pg==4) page4.style.display='block'; //�ط���ʳ
  if(pg==5) page5.style.display='block'; //��������
  if(pg==6) page6.style.display='block'; //��������
  if(pg==7) page7.style.display='block'; //��������
  if(pg==8) page8.style.display='block'; //��˷��
  if(pg==9) page9.style.display='block'; //������
  if(pg==10) page10.style.display='block'; //ʳ��
  if(pg==11) page11.style.display='block'; //�������
  if(pg==12) page12.style.display='block'; //����
  if(pg==13) page13.style.display='block'; //������
}

/********************
��ǰʱ���ʼ��,����Ļ����ʾʱ�䡢���汾��ʱ����Ϣ��
*********************/
function set_date_screen(fw){ //�ѵ�ǰʱ��������Ļ�ı����֮��
 var now=new Date();
 curTZ = now.getTimezoneOffset()/60; //ʱ�� -8Ϊ����ʱ
 curJD = now/86400000-10957.5 - curTZ/24; //J2000�������������(��ǰ����ʱ��)
 JD.setFromJD(curJD+J2000);

 if(!fw||fw==1){
  Cml_y.value = JD.Y;
  Cml_m.value = JD.M;
  Cml_d.value = JD.D;
  Cml_his.value = JD.h+':'+JD.m+':'+JD.s.toFixed(0);
 }

 if(!fw||fw==2){
  Cal_y.value = JD.Y;
  Cal_m.value = JD.M;
 }
 curJD=int2(curJD+0.5);
}
set_date_screen(0);

/****************
���ʱ��ѡ��
****************/
function change_dq(){ //���һ�����ı�
  var i,v = Sel_dq.options[Sel_dq.selectedIndex].value;
  v = v.split('#');
  Sel_dq.v = v[0]; //����ʱ��
  Sel_dq.rg= v[1]; //�չ��Լ����
  Sel_sqsm.innerHTML=v[2];  //ʱ��˵��
}

function change_zhou(){ //�ޱ�ı�
  var i, ob = SQv[ Sel_zhou.options[Sel_zhou.selectedIndex].value-0 ]; //ĳ������
  Sel_dq.length=0;
  for(i=1; i<ob.length; i+=2) addOp(Sel_dq,ob[i+1],ob[i]);
  change_dq();
}

for(i=0;i<SQv.length;i++) addOp(document.all.Sel_zhou,i,SQv[i][0]);
change_zhou();



function show_clock(t){ //��ʾʱ��,�������ڶ���
  var h  = Sel_dq.v-0, rg='';
  var v  = Sel_dq.rg;
  var jd = t/86400000-10957.5 + h/24; //J2000�������������(����ʱ��)

  Clock1.innerHTML = t.toLocaleString();

  if(v){
   var y1 = JD.Y, y2=y1; //��ʱ�������
   var m1 = v.substr(0,2)-0, m2 = v.substr(5,2)-0;
   if(m2<m1) y2++;
   //nnweek(y,m,n,w)��y��m�µ�n������w��jd
   var J1 = JD.nnweek( y1, m1, v.substr(2,1), v.substr(3,1)-0  )-0.5-J2000 +(v.charCodeAt(4)-97)/24;
   var J2 = JD.nnweek( y2, m2, v.substr(7,1), v.substr(8,1)-0  )-0.5-J2000 +(v.charCodeAt(9)-97)/24;
   if(jd>=J1 && jd<J2) jd+=1/24, rg='<font color=red>��</font>';  //����ʱ
  }
  JD.setFromJD(jd+J2000);
  var mm=JD.m<10? '0'+JD.m:JD.m;
  var ss=int2(JD.s)<10? '0'+int2(JD.s):int2(JD.s);
  document.all.Clock2.innerHTML =h+'ʱ������'+JD.D+'�� ' + rg+JD.h+':'+mm+':'+ss; //Ϊ����clock1ͬ��,����ȡ��������������

}

/****************
����γ��ѡ���ҳ����ƺ���
****************/
function change2(){
  var i,v = new JWdecode( Sel2.options[Sel2.selectedIndex].value );
  Sel2.vJ = v.J; Sel2.vW = v.W;
  Cb_J.value=(v.J/Math.PI*180).toFixed(6), Cb_W.value=(v.W/Math.PI*180).toFixed(6);
  Cf_J.value = Cd_J.value = Cp9_J.value = Cb_J.value;
  Cf_W.value = Cd_W.value = Cp9_W.value = Cb_W.value;
  Cp11_J.value = Cb_J.value
  Cal_zdzb.innerHTML = '�� '+rad2str2(v.J) + ' γ '+rad2str2(v.W);
  showMessD(-2);
  setCookie('Sel1',Sel1.selectedIndex);
  setCookie('Sel2',Sel2.selectedIndex);
}
function change(){
  Sel2.length=0; 
  var i, ob=JWv[ Sel1.options[Sel1.selectedIndex].value-0 ];
  for(i=1; i<ob.length; i++)
   addOp( Sel2, ob[i].substr(0,4), ob[i].substr(4,ob[i].length-4) );
  change2();
}
var i;
for(i=0;i<JWv.length;i++) addOp(document.all.Sel1,i,JWv[i][0]);

var seI1=getCookie('Sel1');
var seI2=getCookie('Sel2');
Sel1.selectedIndex = seI1; change();
Sel2.selectedIndex = seI2; change2();


/**********************
������ּ���
**********************/
function ML_calc(){
 var ob=new Object();
 var t = timeStr2hour(Cml_his.value);
 var jd=JD.JD(year2Ayear(Cml_y.value), Cml_m.value-0, Cml_d.value-0+t/24)

 obb.mingLiBaZi( jd+curTZ/24-J2000, Cp11_J.value/radd, ob ); //���ּ���
 Cal6.innerHTML =
     '<font color=red>  <b>[�ձ�]��</b></font>'+'���� '+Cml_y.value+'-'+Cml_m.value+'-'+Cml_d.value + ' �������� ' + int2(jd+0.5) + ' ��2000����' + int2(jd+0.5-J2000) + '��<br>'
   + '<font color=red  ><b>[����]��</b></font>'    + ob.bz_jn+'�� '+ob.bz_jy+'�� '+ob.bz_jr+'�� '+ob.bz_js+'ʱ ��̫�� <font color=red>' + ob.bz_zty+ '</font><br>'
   + '<font color=red  ><b>[����]��</b></font>'    + ob.bz_jnny+' '+ob.bz_jyny+' '+ob.bz_jrny+' '+ob.bz_jsny+'<br>'
   + '<font color=green><b>[��ʱ]��</b></font><i>' + ob.bz_JS + '</i><br>'
   + '<font color=green><b>[ʱ��]��</b></font><i>' + '23�� 01�� 03�� 05�� 07�� 09�� 11�� 13�� 15�� 17�� 19�� 21�� 23';
}
//ML_calc(); //��ʱ�䡢�ر��ʼ����ɺ�Ϳ�ִ��

function ML_settime(){ set_date_screen(1); ML_calc(); }

/**********************
�������ꡢ����ת���ƺ���
**********************/

function changeYear(ud){ //������(����)һ��
 var y = year2Ayear(Cal_y.value);
 if(y==-10000) return;
 if(ud==0){
   if(y<=-10000) { alert('�����ˣ�'); return; }
   Cal_y.value = Ayear2year(y-1);
 }else{
   if(y>=9999) { alert('�����ˣ�'); return; }
   Cal_y.value = Ayear2year(y+1);
 }
 getLunar();
}
function changeMonth(ud){ //������(����)����
 var y,m;
 y = year2Ayear(Cal_y.value);
 m = Cal_m.value-0;
 if(ud==0){
   if(m<=1 && y<=-10000) { alert('�����ˣ�'); return; }
   if(m<=1) Cal_m.value = 12, Cal_y.value = Ayear2year(y-1);
   else     Cal_m.value = m-1;
 }
 if(ud==1){
   if(m>=12 && y>=9999) { alert('�����ˣ�'); return; }
   if(m>=12) Cal_m.value = 1, Cal_y.value = Ayear2year(y+1);
   else      Cal_m.value = m+1;
 }
 if(ud==2) set_date_screen(2);
 getLunar();
}



/********************
���������
*********************/

function RTS1(jd,vJ,vW,tz){
 SZJ.calcRTS(jd, 1, vJ, vW, tz); //��������,ʹ�ñ�ʱʱ��,tz=-8ָ��8��,jd+tzӦ�ڵ�����������(�����Сʱ��Ҫ��)
 var s, ob = SZJ.rts[0];
// JD.setFromJD(jd+J2000);
 s  = '�ճ� <font color=red>'+ob.s + '</font> ���� '+ob.j +' ���� '+ob.z +'<br>';
 s += '�³� '+ob.Ms+ ' ���� '+ob.Mj+' ���� '+ob.Mz+'<br>';
 s += '�������� '+ob.c + ' ������� '+ob.h +'<br>';
 s += '����ʱ�� '+ob.sj+ ' ����ʱ�� '+ob.ch+'<br>';
 return s;
}


/**********************
����(ĳ��)��Ϣҳ������
**********************/
function showMessD(n){ //��ʱ���µ�n�յ�ժҪ��Ϣ������ǰӦ��ִ����ҳ�����ɣ�������Ч��lun����
 if(event){ if(event.ctrlKey) return; }
 if(!lun.dn||n>=lun.dn) return;
 var vJ = Sel2.vJ-0, vW = Sel2.vW-0;

 if(n==-1){ //����Ƴ������Ϸ�
   Cal_pan.style.display = 'none';
   Cal5.innerHTML = Cal5.bak;
 }
 if(n==-2) Cal5.bak = Cal5.innerHTML = RTS1(curJD, vJ, vW, curTZ);
 if(n<0) return;
 //��ʾnָ����������Ϣ
 var ob = lun.lun[n];
 Cal5.innerHTML = RTS1(ob.d0, vJ, vW, curTZ);

 if(window.event && window.event.srcElement.tagName=='SPAN'){ //����ƹ������Ϸ�

  var J=document.all.Cb_J.value/radd
  obb.mingLiBaZi( ob.d0+curTZ/24, J, ob ); //������������,jdΪ��������UT(J2000����),JΪ���ؾ���,���������ob��

  s  = Ayear2year(ob.y) + '��' + ob.m + '��' + ob.d + '��<br/>'
  s += ob.Lyear4+'�� ����' + JD.Weeks[ob.week] + ' ' + ob.XiZ +'<br/>';
  s += ob.Lyear3+'�� '+ob.Lleap + ob.Lmc + '��' + (ob.Ldn>29?'�� ':'С ') + ob.Ldc + '��<br/>';
  s += ob.Lyear2+'�� '+ob.Lmonth2+'�� '+ob.Lday2+'��<br/>';
  s += ob.bz_jnny+' '+ob.bz_jyny+' '+ob.bz_jrny+'<br/>';
  s += '����['+ob.Hyear+'��'+ob.Hmonth+'��'+ob.Hday+'��]<br/>';
  s += 'JD '+(ob.d0+J2000)+'('+ob.d0+')<br/>';
  if(ob.yxmc) s += ob.yxmc+' '+ob.yxsj+'<br/>';
  if(ob.jqmc) s += '��'+ob.jqmc+' '+ob.jqsj+'<br/>';
  //else { if(ob.Ljq) s += ob.Ljq+'<br/>';}
  if(ob.Ljq) s += '<br/>'+ob.dtpq+' ';//ob.dtpq����ͳ��ƽ������ʱ��ob.Ljqʵ��

  if(ob.A)    s += ob.A +'<br>';
  if(ob.B)    s += ob.B +'<br>';
  if(ob.C)    s += ob.C;
  Cal_pan.style.display = 'block'; //����ʾ�ٴ�ֵ��Ļ����
  Cal_pan_in.innerHTML = s;
  Cal_pan.style.left = window.event.x+document.body.scrollLeft + ( (ob.week>3) ? -180 : 20 );
  Cal_pan.style.top  = window.event.y+document.body.scrollTop  - ( (ob.weeki<2)?    0 :100 );
 }
}

/**********************
����ҳ������
**********************/
function getLunar(){ //����ҳ������

  var By  = year2Ayear(Cal_y.value);
  var Bm  = Cal_m.value-0;
  if(By == -10000) return;

  if(!lun.dn || lun.y!=By || lun.m!=Bm){  //����δ����
   lun.yueLiHTML(By,Bm,curJD);
   Cal2.innerHTML = lun.pg1;
   Cal4.innerHTML = lun.pg2;
  }

  showMessD(-2);
}

getLunar(); //��������ҳ�����ɺ���

/**********************
������ҳ����
**********************/
function getNianLi(dy){ //dy��ʼ���ƫ����
 y=year2Ayear(Cp2_y.value);  if(y==-10000) return;         //�������ֵ
 y+=dy;                      Cp2_y.value = Ayear2year(y); //����ƫ������
 if(y<-10000) { alert('������'); return; } //�������ֵ
 if(Cp2_tg.checked) Cal7.innerHTML = Ayear2year(y)+'��<br>'+nianLiHTML(y);
 else               Cal7.innerHTML = Ayear2year(y)+'��<br>'+nianLi2HTML(y);
}
function getNianLiN(){ //dy��ʼ���ƫ����
 y=year2Ayear(Cp2_y.value);
 if(y==-10000) return; //�������ֵ
 n=Cp2_n.value-0;
 if(n<1||n>500) {alert("������Χ"); return;}
 var i,s='';
 for(i=0;i<n;i++){
  if(Cp2_tg.checked) s += Ayear2year(y+i)+'��<br>'+nianLiHTML(y+i);
  else               s += Ayear2year(y+i)+'��<br>'+nianLi2HTML(y+i);
 }
 Cal7.innerHTML = s;
}

/**********************
ʱ��1�붨ʱ
**********************/
function tick() { //��ʱ�������
  var now = new Date();
  show_clock(now);
  zb_calc();
  window.setTimeout("tick()", 1000);
}
tick(); //����ʱ��
