/* Recknagel — shared monochrome site behaviors */
(function(){
  // theme toggle (dark <-> light), persisted
  var tog=document.getElementById('themeTog');
  if(tog){
    tog.addEventListener('click',function(){
      var isLight=document.documentElement.getAttribute('data-theme')==='light';
      if(isLight){ document.documentElement.removeAttribute('data-theme'); try{localStorage.setItem('re-theme','dark');}catch(e){} }
      else{ document.documentElement.setAttribute('data-theme','light'); try{localStorage.setItem('re-theme','light');}catch(e){} }
    });
  }

  // scroll progress + nav state
  var prog=document.getElementById('prog'), nav=document.getElementById('nav');

  // mobile menu toggle
  var burger=document.querySelector('.nav-burger');
  if(burger && nav){
    burger.addEventListener('click',function(){
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open')?'true':'false');
    });
    nav.querySelectorAll('.nav-lk a').forEach(function(a){
      a.addEventListener('click',function(){ nav.classList.remove('open'); });
    });
  }
  function onScroll(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    var sc=max>0?h.scrollTop/max:0;
    if(prog)prog.style.width=(sc*100)+'%';
    if(nav)nav.classList.toggle('scrolled', h.scrollTop>40);
  }
  document.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // reveal on scroll
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:0.16,rootMargin:'0px 0px -7% 0px'});
  document.querySelectorAll('.rev:not(.in)').forEach(function(el){ io.observe(el); });

  // count-up
  function countUp(el){
    var target=parseFloat(el.dataset.count), suf=el.dataset.suffix||'', dur=1500, t0=performance.now();
    function tick(t){ var p=Math.min(1,(t-t0)/dur); var e=1-Math.pow(1-p,3); el.textContent=Math.round(target*e)+suf; if(p<1)requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  },{threshold:0.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  // hero montage (grayscale crossfade)
  var bg=document.getElementById('herobg');
  if(bg && bg.dataset.imgs){
    var imgs=bg.dataset.imgs.split(',');
    imgs.forEach(function(src,i){
      var ly=document.createElement('div'); ly.className='ly'+(i===0?' on':'');
      ly.innerHTML='<div class="ph" style="background-image:url(\''+src.trim()+'\')"></div>';
      bg.appendChild(ly);
    });
    var i=0;
    setInterval(function(){ var ls=bg.querySelectorAll('.ly'); ls[i].classList.remove('on'); i=(i+1)%ls.length; ls[i].classList.add('on'); },5200);
  }

  // smooth page transition veil on internal navigation
  var veil=document.querySelector('.veil');
  if(veil){
    document.querySelectorAll('a[href$=".html"]').forEach(function(a){
      a.addEventListener('click',function(ev){
        var href=a.getAttribute('href');
        if(!href||href.indexOf('#')===0||a.target==='_blank')return;
        ev.preventDefault();
        veil.classList.add('show');
        setTimeout(function(){ window.location.href=href; },520);
      });
    });
    window.addEventListener('pageshow',function(){ veil.classList.remove('show'); });
  }
})();
