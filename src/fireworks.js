import React from 'react'

// Thanks Tim! https://codepen.io/timohausmann/pen/mGHbq?page=1&
class Fireworks extends React.Component {
  componentDidMount() {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height
    let lastUpdate = new Date()
    let mouseUpdate = new Date()
    let lastMouse = []
    const particles = []

    function randMinMax(min, max, round) {
      var val = min + Math.random() * (max - min)

      return val
    }

    const TO_RAD = Math.PI / 180

    function getAngle(x1, y1, x2, y2) {
      var dx = x1 - x2
      const dy = y1 - y2

      return Math.atan2(dy, dx)
    }

    function getDistance(x1, y1, x2, y2) {
      var xs = x2 - x1,
        ys = y2 - y1

      xs *= xs
      ys *= ys

      return Math.sqrt(xs + ys)
    }

    setTimeout(function() {
      setFullscreen()

      for (let i = 0; i < 40; i = i + 1) {
        setTimeout(function() {
          createParticle({
            x: width / 2 - 150 + i / 40 * 300,
            degree: randMinMax(225, 135),
          })
        }, i * 20)
      }

      loop()
    }, 100)

    canvas.addEventListener('mousemove', function(e) {
      var thisUpdate = new Date(),
        thisMouse = [e.offsetX || e.layerX, e.offsetY || e.layerY],
        degree = 0,
        distance = 0,
        hue = 180

      if (thisUpdate - mouseUpdate < 20) return

      degree = getAngle(thisMouse[0], thisMouse[1], lastMouse[0], lastMouse[1])
      degree /= TO_RAD
      degree += 180

      distance = getDistance(
        thisMouse[0],
        thisMouse[1],
        lastMouse[0],
        lastMouse[1],
      )
      if (distance < 1) distance = 1

      hue = 180 * (degree / 360)

      createParticle({
        color: 'hsla(' + hue + ', 100%, 50%, ' + Math.random().toFixed(2) + ')',
        x: thisMouse[0],
        y: thisMouse[1],
        degree: degree,
        speed: distance * 20,
        vs: -distance / 3,
      })

      mouseUpdate = thisUpdate
      lastMouse = thisMouse
    })
    canvas.addEventListener('mousedown', function(e) {
      for (var i = 0; i < 40; i = i + 1) {
        createParticle({
          x: e.offsetX || e.layerX,
          y: e.offsetY || e.layerY,
          color:
            'hsla(' +
            randMinMax(290, 360) +
            ', 100%, 50%, ' +
            Math.random().toFixed(2) +
            ')',
          speed: randMinMax(100, 350),
        })
      }
    })
    addEventListener('resize', setFullscreen)

    function createParticle(args) {
      var options = {
        x: width / 2,
        y: height / 2,
        color:
          'hsla(' +
          randMinMax(160, 290) +
          ', 100%, 50%, ' +
          Math.random().toFixed(2) +
          ')',
        degree: randMinMax(0, 360),
        speed: randMinMax(200, 250),
        vd: randMinMax(-90, 90),
        vs: randMinMax(-8, -5),
      }

      for (var key in args) {
        options[key] = args[key]
      }

      particles.push(options)
    }

    function loop() {
      var thisUpdate = new Date(),
        delta = (lastUpdate - thisUpdate) / 1000,
        amount = particles.length,
        size = 2,
        i = 0,
        p

      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(0, 0, width, height)

      for (; i < amount; i = i + 1) {
        p = particles[i]

        p.degree += p.vd * delta
        p.speed += p.vs
        if (p.speed < 0) continue

        p.x += Math.cos(p.degree * TO_RAD) * (p.speed * delta)
        p.y += Math.sin(p.degree * TO_RAD) * (p.speed * delta)

        if (p.x < 0 || p.x > width) {
          p.degree = 180 - p.degree
        }
        if (p.y < 0 || p.y > height) {
          p.degree *= -1
        }

        ctx.save()

        ctx.translate(p.x, p.y)
        ctx.rotate(p.degree * TO_RAD)

        ctx.fillStyle = p.color
        ctx.fillRect(-size, -size, size * 2, size * 2)

        ctx.restore()
      }

      lastUpdate = thisUpdate

      requestAnimationFrame(loop)
    }

    function setFullscreen() {
      width = canvas.width = innerWidth * 0.8
      height = canvas.height = innerHeight * 0.8
    }
    this.cleanup = () => {
      removeEventListener('resize', setFullscreen)
    }
  }
  componentWillUnmount() {
    this.cleanup()
  }
  render() {
    return (
      <div>
        <canvas ref={c => (this.canvas = c)} />
      </div>
    )
  }
}

export default Fireworks

/* eslint no-restricted-globals: "off" */
