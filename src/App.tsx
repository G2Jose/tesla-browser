import React, {
  ImgHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react'
import prime from './prime.png'
import appleTv from './appleTv.png'
import disneyPlus from './disneyPlus.png'
import hboMax from './hboMax.png'
import hulu from './hulu.jpeg'
import netflix from './netflix.png'
import youtube from './youtube.webp'
import tikTok from './tikTok.svg'
import google from './google.png'
import xbox from './xbox.png'
import plex from './plex.png'
import './App.css'
import useLongPress from './useLongPress'
import { getIsMobileDevice, getIsTeslaBrowser } from './utils'
import _ from 'lodash'

import * as amplitude from '@amplitude/analytics-browser'
amplitude.init('3b4557c81bc05195a91404b05ab97994')

type TSite = {
  name: string
  url: string
  image: ImgHTMLAttributes<HTMLImageElement>['src']
  style?: React.CSSProperties
}

const TILE_SIZE = window.innerWidth <= 500 ? window.innerWidth / 2.5 : 400

function Site({
  name,
  url,
  image,
  style,
  onRemove,
}: TSite & { onRemove: () => void }) {
  const { handlers } = useLongPress(onRemove, 500)

  return (
    <a
      href={`https://www.youtube.com/redirect?q=${url}`}
      style={{ textAlign: 'center' }}
      {...handlers}
      onClick={e => {
        e.preventDefault()
        amplitude.track('site_opened', { name, url })
        window.open(`https://www.youtube.com/redirect?q=${url}`, '_self')
      }}
      id="open-website"
    >
      <div style={style}>
        <img
          src={image}
          alt={name}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            objectFit: 'cover',
          }}
        />
        <p>{name}</p>
      </div>
    </a>
  )
}

function AddItem({
  onPressAdd,
  name,
  onNameChange,
  onPressCancel,
  onUrlChange,
  url,
}: {
  onPressAdd: () => void
  onPressCancel: () => void
  name?: string
  url?: string
  onNameChange: React.ChangeEventHandler<HTMLInputElement>
  onUrlChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 0.98,
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '80%' }}>
        <div>
          <div>
            <label htmlFor="name" style={{ fontWeight: 'bold' }}>
              Name
            </label>
          </div>
          <div>
            <input
              onChange={onNameChange}
              value={name || ''}
              type="text"
              id="name"
              name="name"
              placeholder=""
              style={{
                padding: '12px 12px',
                margin: '8px 0',
                display: 'inline-block',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="url" style={{ fontWeight: 'bold' }}>
              URL
            </label>
          </div>
          <div>
            <input
              onChange={onUrlChange}
              value={url || ''}
              type="text"
              id="url"
              name="url"
              style={{
                padding: '12px 12px',
                margin: '8px 0',
                display: 'inline-block',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
          </div>
        </div>
        <button
          style={{
            padding: '12px 12px',
            margin: '8px 0',
            border: 'none',
            borderRadius: '8px',
            boxSizing: 'border-box',
            width: '100%',
            cursor: 'pointer',
          }}
          onClick={onPressAdd}
        >
          Add
        </button>
        <button
          style={{
            padding: '12px 12px',
            margin: '8px 0',
            border: 'none',
            borderRadius: '8px',
            boxSizing: 'border-box',
            width: '100%',
            cursor: 'pointer',
          }}
          onClick={onPressCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function addSite({ name, url, image }: TSite) {
  const currentSitesString = localStorage.getItem('sites')
  const currentItems = currentSitesString ? JSON.parse(currentSitesString) : []
  const updatedItems = [...currentItems, { name, url, image }]
  localStorage.setItem('sites', JSON.stringify(updatedItems))
}

function removeSite({ name, url }: Omit<TSite, 'image'>) {
  amplitude.track('site_removed', { name, url })
  const currentSitesString = localStorage.getItem('sites')
  const currentItems: TSite[] = currentSitesString
    ? JSON.parse(currentSitesString)
    : []
  const updatedItems = currentItems.filter(
    item => item.name !== name && item.url !== url
  )
  localStorage.setItem('sites', JSON.stringify(updatedItems))
}

function getStoredSites(): TSite[] {
  const currentSitesString = localStorage.getItem('sites')
  return currentSitesString ? JSON.parse(currentSitesString) : []
}

const SITE_CONFIG: TSite[] = [
  { name: 'Netflix', image: netflix, url: 'https://netflix.com' },
  { name: 'YouTube', image: youtube, url: 'https://youtube.com' },
  { name: 'Disney+', image: disneyPlus, url: 'https://disneyplus.com' },
  { name: 'Apple TV+', image: appleTv, url: 'https://tv.apple.com/' },
  { name: 'HBO Max', image: hboMax, url: 'https://www.hbomax.com/' },
  { name: 'Amazon Prime', image: prime, url: 'https://primevideo.com' },
  { name: 'Hulu', image: hulu, url: 'https://hulu.com' },
  { name: 'TikTok', image: tikTok, url: 'https://tiktok.com' },
  {
    name: 'Google',
    image: google,
    url: 'https://google.com',
  },
  {
    name: 'Xbox Cloud',
    image: xbox,
    url: 'https://www.xbox.com/play/',
  },
  {
    name: 'Plex',
    image: plex,
    url: 'https://app.plex.tv',
  },
].sort((a, b) => (a.name < b.name ? -1 : 1))

function Intro({ onPressGotIt }: { onPressGotIt: () => void }) {
  const isOnMobile = getIsMobileDevice()

  const isOnTesla = getIsTeslaBrowser()

  return (
    <div
      style={{
        borderColor: 'grey',
        borderWidth: 'thin',
        borderStyle: 'solid',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 12,
        margin: 6,
      }}
    >
      {/* {!isOnTesla && !isOnMobile && (
        <p>Open this site on your smartphone or Tesla's browser.</p>
      )} */}
      {/* {!isOnTesla && isOnMobile && <p>Open this site on your Tesla Browser.</p>} */}
      <p>
        Click any item below to open in fullscreen.
        {/* If using this from your
        smartphone, select the Tesla app on the sharesheet that opens. */}
      </p>
      <p>Press the '+' icon to save a new site.</p>
      {/* {!isOnTesla && <p>Long press to delete an item.</p>} */}
      <p>
        Running into issues, have feature requests or have other feedback? I'd
        love to hear it at{' '}
        <a href="mailto:support@fullscreentesla.com?subject=Fullscreen Tesla Feedback">
          support@fullscreentesla.com
        </a>
        !
      </p>
      <button style={{ padding: 8 }} onClick={onPressGotIt}>
        Got it
      </button>
    </div>
  )
}

function App() {
  const [sites, setSites] = useState<TSite[]>([])

  const refreshSites = useCallback(() => {
    setSites(_.uniqBy([...getStoredSites(), ...SITE_CONFIG], x => x.url))
  }, [])

  useEffect(() => {
    const storedSites = getStoredSites()
    if (!storedSites.length) {
      SITE_CONFIG.map(x => addSite(x))
      refreshSites()
    }
  }, [refreshSites])

  useEffect(refreshSites, [refreshSites])

  const [isAdding, setIsAdding] = useState(false)

  const [name, setName] = useState<string | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const startAdding = useCallback(() => setIsAdding(true), [])

  const onPressCancel = useCallback(() => {
    setIsAdding(false)
  }, [])

  const onPressAdd = useCallback(
    (name?: string, url?: string) => {
      setIsAdding(false)

      if (name && url) {
        const imageUrl = `https://logo.clearbit.com/${url}?size=800`
        addSite({ name, url, image: imageUrl })
        amplitude.track('site_added', { name, url })
        setName(undefined)
        setUrl(undefined)
        refreshSites()
      }
    },
    [refreshSites]
  )

  const onRemove = useCallback(
    (site: TSite) => {
      // eslint-disable-next-line no-restricted-globals
      const value = confirm(`Would you like to remove ${site.name}?`)
      if (value) {
        removeSite({ name: site.name, url: site.url })
        refreshSites()
      }
    },
    [refreshSites]
  )

  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="App" style={{ margin: '20px' }}>
      {/* <p>{window.innerWidth}</p> */}
      {isAdding && (
        <AddItem
          onPressAdd={() => onPressAdd(name, url)}
          onNameChange={e => setName(e.target.value)}
          onUrlChange={e => setUrl(e.target.value)}
          url={url}
          name={name}
          onPressCancel={() => onPressCancel()}
        />
      )}
      {showHelp && <Intro onPressGotIt={() => setShowHelp(false)} />}
      {!showHelp && (
        <button style={{ padding: 8 }} onClick={() => setShowHelp(true)}>
          Help &amp; Feedback
        </button>
      )}
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        <>
          {sites.map((x, i) => (
            <Site
              {...x}
              key={i}
              style={{ marginBottom: 50, margin: 4 }}
              onRemove={() => onRemove(x)}
            />
          ))}

          <button
            style={{
              margin: 4,
              width: TILE_SIZE,
              height: TILE_SIZE,
              borderWidth: 0,
              fontSize: 40,
              cursor: 'pointer',
            }}
            onClick={startAdding}
          >
            +
          </button>
          {new Array(4).fill(undefined).map((x, i) => (
            <div
              key={i}
              style={{ width: TILE_SIZE, height: 0, backgroundColor: 'red' }}
            ></div>
          ))}
        </>
      </div>
    </div>
  )
}

export default App
