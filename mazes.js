mazes = {
  levels: [
    
    function(start) {
      maxDistance = 100
      paintManCopies = true
      start.room({
        map: [
          '#####',
          '#Y$Y#',
          '#####',
        ],
        keymap: [
          '#####',
          '#1$0#',
          '#####',
        ],        
      })
      cells[3].room({
        map: [
          'yry',
          '#.#',
          'G#G',
          '.B.',
          '.$.',
        ],
        keymap: [
          '021',
          '#.#',
          '0#1',
          '.0.',
          '.$.',
        ]
      })
      cells[6].walk('lluuuu').link({to: cells[3], x: 0.5, y: -1, z: 0.12})
      cells[29].walk('rr')
      return cells[29]
    },
  
    //password 2
    function(start) {
      start.room({
        map: [
          'rgbaAa$GYRMCB@',
          'cmy...y.......',
          '..rbcgm.......',
        ],
        keymap: [
          '222110$001101@',
          '222...0.......',
          '..00000.......',
        ]
      })
    },
  
    //alternate path
    function(start) {
      start.room({
        map: [
          '..#y...',
          'b.Br...',
          '#Y##YR@',
          '.#.g...',
          '.GgG...',
          '...r...',
          '...$...'
        ],
        keymap: [
          '..#1...',
          '1.10...',
          '#1##11@',
          '.#.1...',
          '.100...',
          '...1...',
          '...$...'
        ]
      })      
    },
  
    //password
    function(start) {
      start.room({
        map: [
          'rgbcmy$YRMCBG@'
        ],
        keymap: [
          '222222$110110@'
        ]
      })
    },
    
    //stack
    function(start) {
      start.room({
        map: [
          '@M$',
          '..C',
          'mC#',
          '..Y',
          'cY#',
          '..G',
          'yG#',
          '..B',
          'gB#',
          '..R',
          'bR#',
          '..r',
        ],
        keymap: [
          '@1$',
          '..0',
          '21#',
          '..0',
          '21#',
          '..0',
          '21#',
          '..0',
          '21#',
          '..0',
          '21#',
          '..2',
        ],        
      })
    },
    function(start) {
      maxDistance = 70
      maxPaintingDistance = 700
      start.walk('ruuluurrd')
      cells[3].walk('ru', cells[9])
      cells[1].walk('rrudr')
      cells[8].walk('rrdd').exit()
    },
    function(start) {
      start.walk('rr').exit()
    }
  ],
}