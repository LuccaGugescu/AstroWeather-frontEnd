import { IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuButton, IonMenuToggle, IonPage, IonRow, IonSkeletonText, IonSplitPane, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import './Sun.css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { useIonLoading } from '@ionic/react';
import SunTexture from '../components/SunTexture';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { SOLAR_WIND_DATA, SUN_DATA, textureList } from "../constants/index";
import DataCard from '../components/DataCard';
import InfoButton from '../components/InfoButton';
import FreqDescription from '../components/FreqDescription';
import CustomDataCard from '../components/CustomDataCard';
import DataModal from '../components/DataModal';
import { planet, sparkles, sunny } from 'ionicons/icons';

interface Page {
    title: string;
    path: string;
    icon: string;
}

const pages: Page[] = [
    { title: 'Learn', path: '/learn', icon: planet },
    { title: 'Sun', path: '/sun', icon: sunny },
    { title: 'Aurora', path: '/aurora', icon: sparkles }
];

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const Sun: React.FC = () => {
    const [texture, setTexture] = useState("https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0193.mp4");
    const { height, width } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [solarWindData, setSolarWindData] = useState({
        x: 0,
        y: 0
    });
    const [loadSolarData, setLoadSolarData] = useState(true);

    const [dataDescription, setDataDescription] = useState({
        title: "rea",
        icon: "bz.png",
        description: ""
    });

    const [description, setDescription] = useState({
        title: "AIA 193 A",
        waveLight: 193,
        object: "Sharpener",
        temperature: 1000000,
        color: "Light brown",
        height: 1.93,
        image: "sharper.png"
    });
    const [plasmaData, setPlasmaData] = useState({
        density: 0,
        temperature: 0,
        speed: 0,
        phi: 0
    });
    const [isLoadingPlasma, setIsLoadingPlasma] = useState(true);
    const [activePage, setActivePage] = useState(pages[1].title);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        videoRef.current?.load();
        setIsLoading(true);
        const interval = setInterval(() => {
            setIsLoading(false);
        }, 3000);
        return () => {
            clearInterval(interval);
        };
    }, [texture]);



    useEffect(() => {
        fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setSolarWindData({
                        x: result[1][1],
                        y: result[1][2],
                    });
                    setLoadSolarData(false);
                    setPlasmaData((prev) => {
                        let copy = Object.assign({}, prev);
                        copy.phi = result[1][4];
                        return copy
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setLoadSolarData(false);
                    alert(error);
                }
            )
        fetch("https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setPlasmaData((prev) => {
                        return {
                            phi: prev.phi,
                            density: result[1][1],
                            speed: result[1][2],
                            temperature: result[1][3]
                        }
                    });
                    setIsLoadingPlasma(false);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoadingPlasma(false);
                    alert(error);
                }
            )

        const interval = setInterval(() => {
            setIsLoading(false);
        }, 3000);
        return () => {
            clearInterval(interval);
        };
    }, [])


    const renderMenuItems = (): JSX.Element[] => {
        return pages.map((page: Page) => (
            <IonMenuToggle key={page.title} auto-hide="false">
                <IonItem href={page.path}
                    color={page.title === activePage ? 'primary' : ''}
                >
                    <IonIcon slot="start" icon={page.icon}></IonIcon>
                    <IonLabel>
                        {page.title}
                    </IonLabel>
                </IonItem>
            </IonMenuToggle>
        ));
    }




    return width < 800  ? (
                    <IonPage id="main">
                        <IonHeader className="hidden-lg">
                            <IonToolbar>
                                <IonTitle>Sun</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent fullscreen>
                            <IonHeader collapse="condense">
                                <IonToolbar>
                                    <IonTitle size="large">Sun</IonTitle>
                                </IonToolbar>
                            </IonHeader>
                            <IonCardSubtitle style={{ marginLeft: 30, marginTop: 30 }}>
                                Frequency Length
                            </IonCardSubtitle>
                            <Swiper
                                style={{ padding: "0px 50px 0px 20px", margin: "10px 0px 0px 0px" }}
                                // install Swiper modules
                                modules={[Navigation]}
                                spaceBetween={10}
                                slidesPerView={2}
                                navigation
                                breakpoints={{
                                    // when window width is >= 480px
                                    0: {
                                        navigation: {
                                            enabled: false
                                        }
                                    },
                                    480: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                        navigation: {
                                            enabled: false
                                        }
                                    },
                                    // when window width is >= 640px
                                    640: {
                                        slidesPerView: 3,
                                        spaceBetween: 40,
                                        navigation: {
                                            enabled: false
                                        }
                                    },
                                    820: {
                                        slidesPerView: 5,
                                        spaceBetween: 40,
                                        navigation: {
                                            enabled: true
                                        }

                                    },
                                    1022: {
                                        slidesPerView: 4,
                                        spaceBetween: 40,
                                        navigation: {
                                            enabled: true,

                                        }
                                    },
                                    1400: {
                                        slidesPerView: 6,
                                        spaceBetween: 40,
                                        navigation: {
                                            enabled: true
                                        }
                                    },
                                }
                                }

                            >

                                {
                                    textureList.map(({ image, name, link }) => {
                                        return (
                                            <SwiperSlide key={name} >
                                                <SunTexture image={image} name={name} link={link} setTexture={setTexture} selectedLink={texture} setDescription={setDescription} />
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                            <IonRow className="ion-justify-content-center">
                                {
                                    isLoading === false ? (
                                        <div style={{ position: "relative" }}>
                                            <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: "800px" }} key={texture} loop>
                                                <source src={texture} type="video/mp4" />
                                            </video>
                                            <InfoButton />
                                            <FreqDescription {...description} />
                                        </div>
                                    ) :
                                        (
                                            <IonSkeletonText style={{ marginTop: 20, marginBottom: 20, width: "100%", maxWidth: 800, height: 500 }} animated={true}></IonSkeletonText>
                                        )
                                }

                            </IonRow>

                            <IonTitle size="large" style={{ fontSize: 32, marginLeft: 15, marginTop: 20 }}>
                                Sun Data
                            </IonTitle>
                            <IonGrid className="grid-ion">
                                <IonRow> {
                                    SUN_DATA.map(({ iconName, name, value, id }) => {
                                        return (
                                            <IonCol col-6 col-sm key={id }><DataCard setDataDescription={setDataDescription} id={id} iconName={iconName} name={name} value={value} setIsOpen={setIsOpen} /></IonCol>
                                        )
                                    })
                                }
                                </IonRow>
                            </IonGrid>
                            <DataModal setIsOpen={setIsOpen} isOpen={isOpen} description={dataDescription.description} icon={dataDescription.icon} title={dataDescription.title} />
                            <div style={{ width: "100%", height: 5, backgroundColor: "#221D1D" }}></div>
                            <IonTitle size="large" style={{ fontSize: 32, marginLeft: 15, marginTop: 20 }}>
                                Solar Wind
                            </IonTitle>
                            <IonGrid className="grid-ion">
                                <IonRow>
                                    {
                            SOLAR_WIND_DATA.map(({ iconName, name, id, unity }) => {
                
                                            return !isLoadingPlasma ? (
                                                <IonCol col-6 col-sm key={id }><DataCard unity={unity}  setDataDescription={setDataDescription} id={id} iconName={iconName} name={name} setIsOpen={setIsOpen} value={plasmaData} key={name} /></IonCol>
                                            ) :
                                                (
                                                    <IonSkeletonText style={{ marginTop: 20, marginBottom: 20, width: "100%", maxWidth: 300, height: 300 }} animated={true}></IonSkeletonText>
                                                )
                                        })
                                    }
                                    <IonCol col-6 col-sm><CustomDataCard setIsOpen={setIsOpen} setDataDescription={setDataDescription} x={solarWindData.x} y={solarWindData.y} /></IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonContent>
                    </IonPage>
    ) : 
        (
            <IonSplitPane contentId="main">
                {/*--  the side menu  --*/}

                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar style={{ padding: "10px 10px 10px 10px" }}>
                            <img src="/assets/icon/astroweather.png" width="200px" />
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-justify-content-center">
                        <IonList>
                            {renderMenuItems()}
                        </IonList>
                    </IonContent>
                </IonMenu>

                <IonPage id="main">
                    <IonHeader className="hidden-lg">
                        <IonToolbar>
                            <IonTitle>Sun</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen>
                        <IonHeader collapse="condense">
                            <IonToolbar>
                                <IonTitle size="large">Sun</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonCardSubtitle style={{ marginLeft: 30, marginTop: 30 }}>
                            Frequency Length
                        </IonCardSubtitle>
                        <Swiper
                            style={{ padding: "0px 50px 0px 20px", margin: "10px 0px 0px 0px" }}
                            // install Swiper modules
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView={2}
                            navigation
                            breakpoints={{
                                // when window width is >= 480px
                                0: {
                                    navigation: {
                                        enabled: false
                                    }
                                },
                                480: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    navigation: {
                                        enabled: false
                                    }
                                },
                                // when window width is >= 640px
                                640: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                    navigation: {
                                        enabled: false
                                    }
                                },
                                820: {
                                    slidesPerView: 5,
                                    spaceBetween: 40,
                                    navigation: {
                                        enabled: true
                                    }

                                },
                                1022: {
                                    slidesPerView: 4,
                                    spaceBetween: 40,
                                    navigation: {
                                        enabled: true,

                                    }
                                },
                                1400: {
                                    slidesPerView: 6,
                                    spaceBetween: 40,
                                    navigation: {
                                        enabled: true
                                    }
                                },
                            }
                            }

                        >

                            {
                                textureList.map(({ image, name, link }) => {
                                    return (
                                        <SwiperSlide key={name}>
                                            <SunTexture image={image} name={name} link={link} setTexture={setTexture} selectedLink={texture} setDescription={setDescription} />
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                        <IonRow className="ion-justify-content-center">
                            {
                                isLoading === false ? (
                                    <div style={{ position: "relative" }}>
                                        <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: "800px" }} key={texture} loop>
                                            <source src={texture} type="video/mp4" />
                                        </video>
                                        <InfoButton />
                                        <FreqDescription {...description} />
                                    </div>
                                ) :
                                    (
                                        <IonSkeletonText style={{ marginTop: 20, marginBottom: 20, width: "100%", maxWidth: 800, height: 500 }} animated={true}></IonSkeletonText>
                                    )
                            }

                        </IonRow>

                        <IonTitle size="large" style={{ fontSize: 32, marginLeft: 15, marginTop: 20 }}>
                            Sun Data
                        </IonTitle>
                        <IonGrid className="grid-ion">
                            <IonRow> {
                                SUN_DATA.map(({ iconName, name, value, id }) => {
                                    return (
                                        <IonCol col-6 col-sm key={id }><DataCard setDataDescription={setDataDescription} id={id} iconName={iconName} name={name} value={value} setIsOpen={setIsOpen} /></IonCol>
                                    )
                                })
                            }
                            </IonRow>
                        </IonGrid>
                        <DataModal setIsOpen={setIsOpen} isOpen={isOpen} description={dataDescription.description} icon={dataDescription.icon} title={dataDescription.title} />
                        <div style={{ width: "100%", height: 5, backgroundColor: "#221D1D" }}></div>
                        <IonTitle size="large" style={{ fontSize: 32, marginLeft: 15, marginTop: 20 }}>
                            Solar Wind
                        </IonTitle>
                        <IonGrid className="grid-ion">
                            <IonRow>
                                {
                                    SOLAR_WIND_DATA.map(({ iconName, name, id }) => {
                                        return !isLoadingPlasma ? (
                                            <IonCol col-6 col-sm key={id }><DataCard setDataDescription={setDataDescription} id={id} iconName={iconName} name={name} setIsOpen={setIsOpen} value={plasmaData} key={name} /></IonCol>
                                        ) :
                                            (
                                                <IonSkeletonText style={{ marginTop: 20, marginBottom: 20, width: "100%", maxWidth: 300, height: 300 }} animated={true}></IonSkeletonText>
                                            )
                                    })
                                }
                                <IonCol col-6 col-sm><CustomDataCard setIsOpen={setIsOpen} setDataDescription={setDataDescription} x={solarWindData.x} y={solarWindData.y} /></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>
                </IonPage>
            </IonSplitPane>
        );
};

export default Sun;
