document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-count]').forEach(el=>{const n=Number(el.dataset.count),start=performance.now();function tick(now){const p=Math.min((now-start)/850,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)});
  window.toggleNav=()=>document.getElementById('sidebar')?.classList.toggle('open');
  function chart(id,labels,series){const canvas=document.getElementById(id);if(!canvas||!window.Chart)return;new Chart(canvas,{type:'line',data:{labels,datasets:series.map((s,i)=>({label:s[0],data:s[1],borderColor:['#38d6d0','#ffb45f','#9d88ff'][i],backgroundColor:['#38d6d01a','#ffb45f12','#9d88ff12'][i],fill:true,tension:.38,pointRadius:3,borderWidth:2}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#a9bdca',usePointStyle:true,boxWidth:7,font:{size:10}}}},scales:{x:{grid:{display:false},ticks:{color:'#829aaa'},border:{display:false}},y:{grid:{color:'#ffffff0b'},ticks:{color:'#829aaa'},border:{display:false}}}}})}
  chart('trend',['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],[['Water index',[78,81,76,83,73,79,82]],['Community signal',[18,21,20,28,25,34,31]]]);
  chart('waterChart',['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],[['Water index',[78,81,76,83,73,79,82]],['Turbidity',[2,2.4,3.1,4.2,6.2,5.4,4.8]]]);
  const mapEl=document.getElementById('miniMap')||document.getElementById('fullMap');
  if(!mapEl||!window.L)return;
  const full=mapEl.id==='fullMap';
  const map=L.map(mapEl,{scrollWheelZoom:full}).setView([22.8,79.0],full?4.6:4.3);
  window.aquaMap=map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
  const zones=[
    {name:'Jalandhar · Punjab',state:'Punjab',lat:31.326,lng:75.576,risk:'High',water:'Turbidity 6.2 NTU',cases:'12 demo reports',desc:'Illustrative elevated turbidity signal. Confirm with an authorized laboratory sample.'},
    {name:'Ludhiana · Punjab',state:'Punjab',lat:30.901,lng:75.857,risk:'Moderate',water:'Chlorine 0.3 mg/L',cases:'7 demo reports',desc:'Illustrative moderate signal. Review routine monitoring data.'},
    {name:'New Delhi · Delhi',state:'Delhi',lat:28.614,lng:77.209,risk:'High',water:'TDS 620 mg/L',cases:'14 demo reports',desc:'Illustrative high-priority monitoring flag for demonstration.'},
    {name:'Jaipur · Rajasthan',state:'Rajasthan',lat:26.912,lng:75.787,risk:'Low',water:'pH 7.4',cases:'2 demo reports',desc:'Routine illustrative sample; continue periodic checks.'},
    {name:'Lucknow · Uttar Pradesh',state:'Uttar Pradesh',lat:26.847,lng:80.947,risk:'Moderate',water:'Turbidity 3.8 NTU',cases:'8 demo reports',desc:'Illustrative moderate turbidity signal; repeat sampling.'},
    {name:'Varanasi · Uttar Pradesh',state:'Uttar Pradesh',lat:25.317,lng:82.974,risk:'High',water:'Turbidity 5.9 NTU',cases:'11 demo reports',desc:'Illustrative elevated turbidity and community signal.'},
    {name:'Dehradun · Uttarakhand',state:'Uttarakhand',lat:30.316,lng:78.032,risk:'Low',water:'pH 7.1',cases:'1 demo report',desc:'Routine illustrative monitoring location.'},
    {name:'Shimla · Himachal Pradesh',state:'Himachal Pradesh',lat:31.104,lng:77.173,risk:'Low',water:'Chlorine 0.5 mg/L',cases:'2 demo reports',desc:'Routine illustrative sample.'},
    {name:'Ahmedabad · Gujarat',state:'Gujarat',lat:23.022,lng:72.571,risk:'Moderate',water:'TDS 510 mg/L',cases:'6 demo reports',desc:'Illustrative TDS review flag.'},
    {name:'Mumbai · Maharashtra',state:'Maharashtra',lat:19.076,lng:72.878,risk:'High',water:'Chlorine 0.1 mg/L',cases:'13 demo reports',desc:'Illustrative low residual disinfectant flag; verify measurement.'},
    {name:'Bhopal · Madhya Pradesh',state:'Madhya Pradesh',lat:23.259,lng:77.413,risk:'Low',water:'pH 7.3',cases:'3 demo reports',desc:'Routine illustrative monitoring location.'},
    {name:'Kolkata · West Bengal',state:'West Bengal',lat:22.573,lng:88.364,risk:'Moderate',water:'Turbidity 4.1 NTU',cases:'9 demo reports',desc:'Illustrative moderate turbidity flag.'},
    {name:'Bhubaneswar · Odisha',state:'Odisha',lat:20.297,lng:85.825,risk:'Low',water:'pH 7.2',cases:'2 demo reports',desc:'Routine illustrative sample.'},
    {name:'Hyderabad · Telangana',state:'Telangana',lat:17.385,lng:78.487,risk:'Moderate',water:'TDS 480 mg/L',cases:'6 demo reports',desc:'Illustrative moderate monitoring signal.'},
    {name:'Chennai · Tamil Nadu',state:'Tamil Nadu',lat:13.082,lng:80.270,risk:'High',water:'Turbidity 5.6 NTU',cases:'10 demo reports',desc:'Illustrative elevated turbidity flag; confirm by resampling.'},
    {name:'Bengaluru · Karnataka',state:'Karnataka',lat:12.972,lng:77.595,risk:'Low',water:'pH 7.0',cases:'3 demo reports',desc:'Routine illustrative monitoring location.'},
    {name:'Kochi · Kerala',state:'Kerala',lat:9.931,lng:76.267,risk:'Low',water:'Chlorine 0.4 mg/L',cases:'2 demo reports',desc:'Routine illustrative sample.'},
    {name:'Vijayawada · Andhra Pradesh',state:'Andhra Pradesh',lat:16.506,lng:80.648,risk:'Moderate',water:'Turbidity 3.5 NTU',cases:'5 demo reports',desc:'Illustrative moderate signal; repeat sample.'},
    {name:'Guwahati · Assam',state:'Assam',lat:26.145,lng:91.736,risk:'Moderate',water:'Turbidity 4.7 NTU',cases:'8 demo reports',desc:'Illustrative monitoring flag; review after heavy rainfall.'},
    {name:'Raipur · Chhattisgarh',state:'Chhattisgarh',lat:21.251,lng:81.629,risk:'Low',water:'pH 7.3',cases:'2 demo reports',desc:'Routine illustrative sample.'}
  ];
  const markers=[];
  zones.forEach(z=>{
    const color=z.risk==='High'?'#ff806d':z.risk==='Moderate'?'#ffbd63':'#45d6a6';
    const marker=L.circleMarker([z.lat,z.lng],{radius:full?8:6,color:'#fff',weight:1.5,fillColor:color,fillOpacity:.95});
    marker.bindPopup(`<b>${z.name}</b><br><span style="color:${color}">${z.risk} signal</span><br>${z.water}<br>${z.cases}`);
    marker.bindTooltip(z.name);marker.zone=z;
    marker.on('click',()=>{const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};put('zoneTitle',z.name);put('zoneDescription',z.desc);put('zoneRisk',z.risk);put('zoneWater',z.water);put('zoneCases',z.cases)});
    marker.addTo(map);markers.push(marker);
  });
  if(full){map.fitBounds(L.latLngBounds(zones.map(z=>[z.lat,z.lng])).pad(.12));}
  const filter=document.getElementById('riskFilter'),search=document.getElementById('zoneSearch');
  function apply(){markers.forEach(marker=>{const z=marker.zone,query=(search?.value||'').toLowerCase(),ok=(!filter||filter.value==='all'||filter.value===z.risk)&&(!query||`${z.name} ${z.state}`.toLowerCase().includes(query));if(ok){if(!map.hasLayer(marker))marker.addTo(map)}else if(map.hasLayer(marker))map.removeLayer(marker)});}
  filter?.addEventListener('change',apply);search?.addEventListener('input',apply);
  window.resetMap=()=>{if(filter)filter.value='all';if(search)search.value='';apply();map.fitBounds(L.latLngBounds(zones.map(z=>[z.lat,z.lng])).pad(.12));};
  setTimeout(()=>map.invalidateSize(),350);
});