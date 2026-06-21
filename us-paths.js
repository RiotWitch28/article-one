/* us-paths.js — loads US state SVG paths from CDN (topojson/us-atlas) */
window.STATE_FULL = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
  IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
  ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
  OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
  TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',
  WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'
};

window.US_PATHS = {};
window.__dcPathsReady = false;

// FIPS → state abbreviation (for us-atlas topojson)
const FIPS = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE',
  '11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA',
  '20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
  '28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM',
  '36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA',
  '54':'WV','55':'WI','56':'WY'
};

(function loadPaths() {
  // Try to load topojson from CDN
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function pathFromRing(ring) {
    if (!ring || !ring.length) return '';
    let d = 'M' + ring[0][0].toFixed(1) + ' ' + ring[0][1].toFixed(1);
    for (let i = 1; i < ring.length; i++) {
      d += 'L' + ring[i][0].toFixed(1) + ' ' + ring[i][1].toFixed(1);
    }
    return d + 'Z';
  }

  function decodeTopojson(topo) {
    const states = topo.objects.states;
    if (!states) return;
    const scale = topo.transform ? topo.transform.scale : [1, 1];
    const translate = topo.transform ? topo.transform.translate : [0, 0];

    function decode(arcs) {
      return arcs.map(arc => {
        let x = 0, y = 0;
        return arc.map(pt => {
          x += pt[0]; y += pt[1];
          return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
        });
      });
    }

    function featureToPath(geom) {
      if (!geom) return '';
      const paths = [];
      function processPolygon(arcIdxs) {
        const rings = arcIdxs.map(ring => {
          const coords = [];
          for (const idx of ring) {
            const arc = idx < 0 ? [...topo.arcs[~idx]].reverse() : topo.arcs[idx];
            let x = 0, y = 0;
            for (const pt of arc) {
              x += pt[0]; y += pt[1];
              coords.push([x * scale[0] + translate[0], y * scale[1] + translate[1]]);
            }
          }
          return pathFromRing(coords);
        });
        paths.push(rings.join(''));
      }
      if (geom.type === 'Polygon') processPolygon(geom.arcs);
      else if (geom.type === 'MultiPolygon') geom.arcs.forEach(processPolygon);
      return paths.join('');
    }

    for (const geo of states.geometries) {
      const abbr = FIPS[geo.id] || FIPS[String(geo.id).padStart(2,'0')];
      if (abbr) window.US_PATHS[abbr.toLowerCase()] = featureToPath(geo);
    }
    window.__dcPathsReady = true;
    document.dispatchEvent(new Event('dc:paths-ready'));
  }

  async function tryLoad() {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');
      const resp = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json');
      const topo = await resp.json();
      const geojson = topojson.feature(topo, topo.objects.states);
      // Use topojson-client to produce feature paths
      // Convert each feature to SVG path via our own simple approach
      // Actually use the raw arcs since we already have the lib
      for (const feat of geojson.features) {
        const abbr = FIPS[feat.id] || FIPS[String(feat.id).padStart(2,'0')];
        if (!abbr) continue;
        // Build path from coordinates
        let d = '';
        function addGeom(geom) {
          if (!geom) return;
          if (geom.type === 'Polygon') {
            for (const ring of geom.coordinates) {
              if (!ring.length) continue;
              d += 'M' + ring.map(p => p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L') + 'Z';
            }
          } else if (geom.type === 'MultiPolygon') {
            for (const poly of geom.coordinates) {
              for (const ring of poly) {
                if (!ring.length) continue;
                d += 'M' + ring.map(p => p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L') + 'Z';
              }
            }
          }
        }
        addGeom(feat.geometry);
        window.US_PATHS[abbr.toLowerCase()] = d;
      }
      window.__dcPathsReady = true;
      document.dispatchEvent(new Event('dc:paths-ready'));
    } catch(e) {
      console.warn('us-paths: CDN load failed, using fallback', e);
      useFallback();
    }
  }

  function useFallback() {
    // Approximate state rectangles in 960x600 Albers-USA space
    const FB = {
      ak:'M 50 480 L 200 480 L 200 580 L 50 580 Z',
      al:'M 594 390 L 632 390 L 632 470 L 594 470 Z',
      ar:'M 536 350 L 576 350 L 576 400 L 536 400 Z',
      az:'M 240 360 L 310 360 L 310 440 L 240 440 Z',
      ca:'M 90 260 L 165 260 L 165 440 L 90 440 Z',
      co:'M 340 300 L 420 300 L 420 360 L 340 360 Z',
      ct:'M 800 200 L 820 200 L 820 220 L 800 220 Z',
      dc:'M 718 270 L 726 270 L 726 278 L 718 278 Z',
      de:'M 752 248 L 762 248 L 762 268 L 752 268 Z',
      fl:'M 620 440 L 720 440 L 720 580 L 620 580 Z',
      ga:'M 638 400 L 690 400 L 690 460 L 638 460 Z',
      hi:'M 260 540 L 380 540 L 380 580 L 260 580 Z',
      ia:'M 534 248 L 590 248 L 590 290 L 534 290 Z',
      id:'M 196 170 L 250 170 L 250 290 L 196 290 Z',
      il:'M 578 258 L 612 258 L 612 350 L 578 350 Z',
      in:'M 614 258 L 648 258 L 648 330 L 614 330 Z',
      ks:'M 428 320 L 526 320 L 526 360 L 428 360 Z',
      ky:'M 616 316 L 720 316 L 720 348 L 616 348 Z',
      la:'M 534 440 L 590 440 L 590 500 L 534 500 Z',
      ma:'M 808 188 L 852 188 L 852 210 L 808 210 Z',
      md:'M 714 256 L 764 256 L 764 280 L 714 280 Z',
      me:'M 846 120 L 886 120 L 886 190 L 846 190 Z',
      mi:'M 630 180 L 700 180 L 700 270 L 630 270 Z',
      mn:'M 524 150 L 590 150 L 590 248 L 524 248 Z',
      mo:'M 534 300 L 600 300 L 600 370 L 534 370 Z',
      ms:'M 574 380 L 610 380 L 610 460 L 574 460 Z',
      mt:'M 222 130 L 370 130 L 370 210 L 222 210 Z',
      nc:'M 660 354 L 786 354 L 786 398 L 660 398 Z',
      nd:'M 372 140 L 500 140 L 500 200 L 372 200 Z',
      ne:'M 390 278 L 530 278 L 530 320 L 390 320 Z',
      nh:'M 826 148 L 850 148 L 850 200 L 826 200 Z',
      nj:'M 768 232 L 790 232 L 790 268 L 768 268 Z',
      nm:'M 310 360 L 390 360 L 390 440 L 310 440 Z',
      nv:'M 148 248 L 220 248 L 220 380 L 148 380 Z',
      ny:'M 740 172 L 820 172 L 820 230 L 740 230 Z',
      oh:'M 660 252 L 706 252 L 706 316 L 660 316 Z',
      ok:'M 418 368 L 536 368 L 536 416 L 418 416 Z',
      or:'M 88 190 L 202 190 L 202 280 L 88 280 Z',
      pa:'M 700 218 L 772 218 L 772 260 L 700 260 Z',
      ri:'M 832 208 L 846 208 L 846 222 L 832 222 Z',
      sc:'M 680 396 L 734 396 L 734 436 L 680 436 Z',
      sd:'M 372 200 L 500 200 L 500 260 L 372 260 Z',
      tn:'M 574 358 L 700 358 L 700 396 L 574 396 Z',
      tx:'M 376 390 L 538 390 L 538 520 L 376 520 Z',
      ut:'M 248 290 L 330 290 L 330 380 L 248 380 Z',
      va:'M 672 280 L 770 280 L 770 320 L 672 320 Z',
      vt:'M 810 150 L 832 150 L 832 196 L 810 196 Z',
      wa:'M 92 120 L 200 120 L 200 190 L 92 190 Z',
      wi:'M 570 180 L 630 180 L 630 248 L 570 248 Z',
      wv:'M 686 286 L 726 286 L 726 330 L 686 330 Z',
      wy:'M 300 218 L 400 218 L 400 292 L 300 292 Z',
    };
    Object.assign(window.US_PATHS, FB);
    window.__dcPathsReady = true;
    document.dispatchEvent(new Event('dc:paths-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryLoad);
  } else {
    tryLoad();
  }
})();
