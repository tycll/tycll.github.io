//
// ���²����ǹ��ߺ�������������ֱ�ӹ�ϵ���������Ҫ����ɾ��
// 1�����Թ���
// 2��˵����
//-->

function K_getJD(){
 JD.Y = Iy.value-0;
 JD.M = Im.value-0;
 JD.D = Id.value-0;
 JD.h = Ih.value-0;
 JD.m = Ii.value-0;
 JD.s = Is.value-0;
 return JD.toJD();
}

function testDD(UT){ //�������
 var s="",T,T2,dt;
 T=(K_getJD()-J2000);  //��ѧʱ
 if(UT){
   T += dt_T(T)-8/24;
 }

 z=new Array(),z2=new Array(); //��������

 msc.calc(T,I_dlLon.value/180*Math.PI,I_dlLat.value/180*Math.PI,0); //�������
 s += msc.toHTML(1);

 //��������㷨����
 L =XL.M_Lon(T/36525,-1); //����
 T2=XL.M_Lon_t(L)*36525;  //����
 dt=(T2-T)*86400;
 s += "<b>��������㷨����:</b><br>";
 s += "���ٵ�������ָ��Dateƽ�ֵ�ƾ��ķ���ʱ�̡��������£�<br>";
 s += "����ʱ��(����):" + T + "<br>";
 s += "����ƾ�(����):" + L + "<br>";
 s += "����ʱ��(����):" + T2 + "<br>";
 s += "�������(��):" +dt +"<br><br>";

 //��������㷨����
 L=XL.E_Lon(T/36525,-1);
 T2=XL.E_Lon_t(L)*36525;
 dt=(T2-T)*86400;
 s += "<b>��������㷨����:</b><br>";
 s += "����ʱ��(����):"+T+"<br>";
 s += "����ƾ�(����):"+L+"<br>";
 s += "����ʱ��(����):"+T2+"<br>";
 s += "�������(��):"+dt+"<br><br>";

 L=XL.MS_aLon(T/36525,-1,60); //-1��ʾ��������ȫ������,60��ʾ��������ֻ��60��Ϳ�����
 T2=XL.MS_aLon_t(L)*36525;
 dt=(T2-T)*86400;
 s += "���ջƾ���������ʱ�����(��):" + dt + "<br><br>";

 out.innerHTML=s;
}


function dingQi_cmp(){ //����������
 var i,T,maxT=0;
 var y=year.value-2000;
 var N=testN.value-0;
 for(i=0;i<N;i++){
  W = (y+i/24)*2*Math.PI;
  T= XL.S_aLon_t2( W ) - XL.S_aLon_t( W ); //���������뾫��Ĳ���
  T = int2( Math.abs(T*36525*86400) );
  if( T>maxT ) maxT=T;
 }
 out.innerHTML = (2000+y)+"��֮��"+N+"�����������뾫���������:"+maxT+"�롣";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingSuo_cmp(){ //��˷���Ժ���
 var i,T,maxT=0;
 var y=year.value-2000;
 var N=testN.value-0;
 var n=int2(y*(365.2422/29.53058886)); //��ֹ�����׾���˷���ĸ���
 for(i=0;i<N;i++){
  W = (n+i/24)*2*Math.PI;
  T= XL.MS_aLon_t2( W ) - XL.MS_aLon_t( W ); //���ܴ����뾫��Ĳ���
  T = int2( Math.abs(T*36525*86400) );
  if( T>maxT ) maxT=T;
 }
 out.innerHTML = (2000+y)+"��֮��"+N+"��˷�մ����뾫���������:"+maxT+"�롣";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingQi_v(){ //���������ٶȲ���
 var d1=new Date(); for(i=0;i<1000;i++) XL.S_aLon_t(0);
 var d2=new Date(); for(i=0;i<1000;i++) XL.S_aLon_t2(0);
 var d3=new Date();
 out.innerHTML =  "�߾���:"+(d2-d1)+"����/ǧ��<br>"
               +  "�;���:"+(d3-d2)+"����/ǧ��<br>";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingSuo_v(){ //��˷�����ٶȲ���
 var d1=new Date(); for(i=0;i<1000;i++) XL.MS_aLon_t(0);
 var d2=new Date(); for(i=0;i<1000;i++) XL.MS_aLon_t2(0);
 var d3=new Date();
 out.innerHTML =  "�߾���:"+(d2-d1)+"����/ǧ��<br>"
               +  "�;���:"+(d3-d2)+"����/ǧ��<br>";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function K_show(f){
 pan_1.style.display='none';
 if(f==1) pan_1.style.display='block';
 out.innerHTML='';
}