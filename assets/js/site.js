(function(){
  // mobile nav
  var nav=document.getElementById('nav'),burger=document.querySelector('.burger[aria-controls="nav"]'),closeB=document.querySelector('.nav-close');
  function setNav(o){if(!nav)return;nav.classList.toggle('open',o);burger&&burger.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';}
  burger&&burger.addEventListener('click',function(){setNav(true);});
  closeB&&closeB.addEventListener('click',function(){setNav(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setNav(false);closeLb();}});

  // lightbox
  var lb=null;
  function closeLb(){if(lb){lb.remove();lb=null;}}
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-full]');if(!b)return;e.preventDefault();
    lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
    var im=document.createElement('img');im.src=b.getAttribute('data-full');im.alt=b.getAttribute('data-alt')||'';
    var x=document.createElement('button');x.type='button';x.setAttribute('aria-label','Close');x.textContent='×';
    lb.appendChild(im);lb.appendChild(x);document.body.appendChild(lb);x.focus();
    lb.addEventListener('click',function(ev){if(ev.target!==im)closeLb();});
  });

  // quote forms (contact page + modal)
  document.querySelectorAll('form.quote').forEach(function(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var msg=f.querySelector('.msg'),d=new FormData(f),ep=f.getAttribute('data-endpoint');
    if(!f.reportValidity())return;
    var lines=[];d.forEach(function(v,k){if(v)lines.push(k+': '+v);});
    function show(t){msg.hidden=false;msg.textContent=t;}
    if(ep){
      fetch(ep,{method:'POST',body:d,headers:{'Accept':'application/json'}}).then(function(r){
        if(!r.ok)throw 0;show(f.getAttribute('data-ok'));f.reset();
      }).catch(function(){show(f.getAttribute('data-mail'));});
    }else{
      show(f.getAttribute('data-mail'));
      try{window.location.href='mailto:'+f.getAttribute('data-to')+'?subject='+encodeURIComponent(f.getAttribute('data-subject'))+'&body='+encodeURIComponent(lines.join('\n'));}catch(err){}
    }
  });});

  // quote modal
  var qm=document.getElementById('qm');
  if(qm&&typeof qm.showModal==='function'){
    document.addEventListener('click',function(e){
      var t=e.target.closest('[data-quote]');if(!t)return;
      e.preventDefault();setNav(false);
      var eq=t.getAttribute('data-quote'),m=t.getAttribute('data-msg'),sel=qm.querySelector('select'),ta=qm.querySelector('textarea');
      if(eq&&sel){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===eq){sel.selectedIndex=i;break;}}}
      if(m&&ta&&!ta.value)ta.value=m;
      qm.showModal();var first=qm.querySelector('input');first&&first.focus();
    });
    qm.querySelector('.qm-x').addEventListener('click',function(){qm.close();});
    qm.addEventListener('click',function(e){if(e.target===qm)qm.close();});
  }

  // project filter chips
  var chips=document.querySelector('.chips');
  if(chips){
    var cards=document.querySelectorAll('.filterable [data-cat]');
    function apply(f){
      chips.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-f')===f?'true':'false');});
      cards.forEach(function(c){c.hidden=!(f==='all'||c.getAttribute('data-cat')===f);});
    }
    chips.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var f=b.getAttribute('data-f');apply(f);try{history.replaceState(null,'',f==='all'?location.pathname:'#'+f);}catch(err){}});
    var h=(location.hash||'').slice(1);if(h&&chips.querySelector('[data-f="'+h+'"]'))apply(h);
  }

  // fleet finder
  var fd=document.getElementById('finder');
  if(fd){
    var ft=fd.querySelector('#ff-type'),fm=fd.querySelector('#ff-min'),fs=fd.querySelector('#ff-src'),out=fd.querySelector('#ff-count'),none=fd.querySelector('.fnone');
    var rows=fd.querySelectorAll('tbody tr'),unit=out.getAttribute('data-unit')||'';
    function run(){
      var t=ft.value,mn=parseFloat(fm.value)||0,sr=fs.value,n=0;
      rows.forEach(function(r){
        var cp=r.getAttribute('data-cap'),ok=(!t||r.getAttribute('data-type')===t)&&(!sr||r.getAttribute('data-src')===sr)&&(!mn||(cp!==''&&parseFloat(cp)>=mn));
        r.hidden=!ok;if(ok)n++;
      });
      out.textContent=n+' / '+rows.length;none.hidden=n>0;
    }
    [ft,fm,fs].forEach(function(el){el.addEventListener('input',run);el.addEventListener('change',run);});run();
  }

  // project map
  var m=document.getElementById('pmap');
  if(m&&window.L){
    var pts=JSON.parse(document.getElementById('pmap-data').textContent);
    var map=L.map(m,{scrollWheelZoom:false}).setView([16.3,106.5],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
    var icon=L.divIcon({className:'',html:'<svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true"><path d="M13 0C5.8 0 0 5.7 0 12.8 0 22.4 13 34 13 34s13-11.6 13-21.2C26 5.7 20.2 0 13 0z" fill="#E30016"/><circle cx="13" cy="13" r="5" fill="#fff"/></svg>',iconSize:[26,34],iconAnchor:[13,34],popupAnchor:[0,-30]});
    pts.forEach(function(p){
      var html='<b>'+p.n+'</b><br>'+p.p+(p.u?'<br><a href="'+p.u+'">'+p.l+' →</a>':'');
      L.marker([p.lat,p.lng],{icon:icon,title:p.n}).addTo(map).bindPopup(html);
    });
  }
})();

/* language menu: close when clicking outside or pressing Escape */
(function () {
  var d = document.querySelector("details.lang");
  if (!d) return;
  document.addEventListener("click", function (ev) { if (d.open && !d.contains(ev.target)) d.open = false; });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && d.open) { d.open = false; d.querySelector("summary").focus(); } });
})();
