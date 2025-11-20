import { useState, useEffect, useRef } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import { Heart, X, Swords } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { IMG_DEFAULT, IMG_ROLES } from "../../constants/images";
import { ROLE_COLORS } from "../../constants/matches";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function StartGGMatchSummoners({ matches, setMatches, setActiveTab }) {
    const { user, refreshUser } = useAuth();
    const [players, setPlayers] = useState([]);
    const [index, setIndex] = useState(0);
    const [exitX, setExitX] = useState(0);
    const [showMatchDialog, setShowMatchDialog] = useState(false);
    const [matchName, setMatchName] = useState("");
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
    const [loading, setLoading] = useState(true);
    const cardRef = useRef(null);

    //valores de movimiento para el drag (DEBEN ir antes de cualquier return condicional)
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

    //transformaciones para los indicadores de like/reject
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const likeScale = useTransform(x, [0, 150], [0.5, 1]);
    const rejectOpacity = useTransform(x, [-150, 0], [1, 0]);
    const rejectScale = useTransform(x, [-150, 0], [1, 0.5]);

    //transformaciones para los colores de fondo de los espacios laterales
    const rightSpaceOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 0.8]);
    const leftSpaceOpacity = useTransform(x, [-200, -100, 0], [0.8, 0.5, 0]);

    //cargar usuarios desde la API
    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/auth/users-for-match`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    const users = data.users || [];
                    //mezclar los usuarios de manera aleatoria
                    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
                    setPlayers(shuffledUsers);
                } else {
                    console.error("Error fetching users for match");
                    setPlayers([]);
                }
            } catch (error) {
                console.error("Error fetching users for match:", error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    //resetear la posición cuando cambia la card
    useEffect(() => {
        if (players.length > 0 && index < players.length) {
            x.set(0);
            setExitX(0);
        }
    }, [index, x, players.length]);

    //resetear exitX cuando se cierra el diálogo
    useEffect(() => {
        if (!showMatchDialog) {
            setExitX(0);
            //usar animate para asegurar que la posición se resetee correctamente
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    }, [showMatchDialog, x]);

    //prevenir scroll horizontal cuando se está en la tab Summoners
    useEffect(() => {
        //prevenir scroll horizontal en el body
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "";
        };
    }, []);

    //si no hay usuarios o ya se mostraron todos, mostrar mensaje
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <div className="text-muted-foreground">Cargando usuarios...</div>
            </div>
        );
    }

    if (players.length === 0 || index >= players.length) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="space-y-2">
                        <Swords className="w-12 h-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-muted-foreground">
                            No more summoners in your region
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            No more users available in your region. Come back later to find new matches!
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const current = players[index];
    const roleColor = ROLE_COLORS[current.role] || "border-gray-500";

    //manejar el like
    const handleLike = async () => {
        const currentPlayer = players[index];
        //verificar si el usuario ya está en los matches antes de agregarlo
        const userAlreadyExists = matches.some((match) => match.id === currentPlayer.id);

        //si ya existe, solo mostrar el diálogo
        if (userAlreadyExists) {
            setMatchName(currentPlayer.name);
            setIsAlreadyAdded(true);
            setShowMatchDialog(true);
            nextCard();
            return;
        }

        //si no existe, agregarlo a la BD y luego al estado local
        try {
            const response = await fetch(`${API_BASE_URL}/auth/add-match`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userId: currentPlayer.id }),
            });

            if (response.ok) {
                const data = await response.json();
                //actualizar matches con los datos del servidor (formato correcto desde el backend)
                if (data.user?.matches) {
                    setMatches(data.user.matches);
                    //actualizar el contexto de autenticación para mantener sincronizado
                    if (refreshUser) {
                        await refreshUser();
                    }
                } else {
                    //si no vienen matches en la respuesta, refrescar desde el servidor
                    console.warn("No matches in response, refreshing user data");
                    if (refreshUser) {
                        const refreshed = await refreshUser();
                        if (refreshed?.user?.matches) {
                            setMatches(refreshed.user.matches);
                        }
                    }
                }
                setMatchName(currentPlayer.name);
                setIsAlreadyAdded(false);
                setShowMatchDialog(true);
            } else {
                const errorData = await response.json();
                console.error("Error adding match:", errorData.message);
                //no agregar localmente si falla - mejor mostrar error y refrescar desde servidor
                if (refreshUser) {
                    const refreshed = await refreshUser();
                    if (refreshed?.user?.matches) {
                        setMatches(refreshed.user.matches);
                    }
                }
                //mostrar mensaje de error pero no agregar localmente
                setMatchName(currentPlayer.name);
                setIsAlreadyAdded(true); //marcar como ya agregado para mostrar mensaje apropiado
                setShowMatchDialog(true);
            }
        } catch (error) {
            console.error("Error adding match:", error);
            //no agregar localmente si falla - mejor refrescar desde servidor
            if (refreshUser) {
                const refreshed = await refreshUser();
                if (refreshed?.user?.matches) {
                    setMatches(refreshed.user.matches);
                }
            }
            setMatchName(currentPlayer.name);
            setIsAlreadyAdded(true); //marcar como ya agregado para mostrar mensaje apropiado
            setShowMatchDialog(true);
        }

        nextCard();
    };

    //manejar el reject
    const handleReject = () => {
        nextCard();
    };

    //manejar el siguiente card
    const nextCard = () => {
        setIndex((prev) => prev + 1);
    };

    //manejar el final del drag
    const handleDragEnd = (event, info) => {
        //si el diálogo está abierto, no procesar el drag
        if (showMatchDialog) {
            x.set(0);
            return;
        }

        //calcular el threshold como el 50% del ancho de la card
        const cardWidth = cardRef.current?.offsetWidth || 384; // 384px es el max-w-sm por defecto
        const threshold = cardWidth * 0.5; // 50% del ancho

        //si se supera el threshold, se considera un swipe
        if (Math.abs(info.offset.x) > threshold) {
            //si se arrastra hacia la derecha (like/agregar)
            if (info.offset.x > 0) {
                setExitX(300);
                handleLike();
            } else {
                //si se arrastra hacia la izquierda (reject/descartar)
                setExitX(-300);
                handleReject();
            }
        } else {
            //si no se supera el threshold, volver a la posición original con animación suave
            setExitX(0);
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    return (
        <>
            {/* Contenedor padre para los espacios de color - ocupa todo el ancho */}
            <div className="relative w-full h-[500px] mt-2">
                {/* Espacio izquierdo (rojo) - mitad de la pantalla, pegado al borde izquierdo */}
                <motion.div
                    className="absolute left-0 top-0 bottom-0 z-0"
                    style={{
                        opacity: leftSpaceOpacity,
                        width: '50%',
                        background: 'linear-gradient(to right, rgba(239, 68, 68, 0.6), transparent)',
                    }}
                />

                {/* Espacio derecho (verde) - mitad de la pantalla, pegado al borde derecho */}
                <motion.div
                    className="absolute right-0 top-0 bottom-0 z-0"
                    style={{
                        opacity: rightSpaceOpacity,
                        width: '50%',
                        background: 'linear-gradient(to left, rgba(34, 197, 94, 0.6), transparent)',
                    }}
                />

                {/* Contenedor de la card - centrado */}
                <div className="flex justify-center h-full">
                    <div
                        ref={cardRef}
                        className="relative h-full w-full max-w-sm touch-none flex items-center"
                        onTouchStart={(e) => {
                            //prevenir scroll horizontal al iniciar el touch
                            const touch = e.touches[0];
                            e.currentTarget.dataset.touchStartX = touch.clientX;
                        }}
                        onTouchMove={(e) => {
                            //prevenir scroll horizontal durante el drag
                            const touch = e.touches[0];
                            const startX = parseFloat(e.currentTarget.dataset.touchStartX || 0);
                            const deltaX = Math.abs(touch.clientX - startX);

                            //si hay movimiento horizontal significativo, prevenir scroll
                            if (deltaX > 5) {
                                e.preventDefault();
                            }
                        }}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id || current.name}
                                drag={showMatchDialog ? false : "x"}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                dragPropagation={false} //para evitar que se propague el drag a otros elementos como la imagen del avatar
                                onDragEnd={handleDragEnd}
                                style={{ x, opacity }}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{
                                    opacity: 0,
                                    x: exitX,
                                    scale: 0.8,
                                    transition: { duration: 0.3 },
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                                className={`absolute w-full h-full bg-neutral-900 rounded-xl p-0 border-4 ${roleColor} ${showMatchDialog ? "cursor-not-allowed pointer-events-none" : "cursor-grab active:cursor-grabbing"} z-10 select-none`}
                            >
                                {/* Indicador de Like (derecha) */}
                                <motion.div
                                    className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 z-10"
                                    style={{
                                        opacity: likeOpacity,
                                        scale: likeScale,
                                    }}
                                >
                                    <Heart className="w-5 h-5 fill-white" />
                                    LIKE
                                </motion.div>

                                {/* Indicador de Reject (izquierda) */}
                                <motion.div
                                    className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 z-10"
                                    style={{
                                        opacity: rejectOpacity,
                                        scale: rejectScale,
                                    }}
                                >
                                    <X className="w-5 h-5" />
                                    NOPE
                                </motion.div>

                                {/* Grid principal: 50% superior y 50% inferior */}
                                <div className="grid grid-rows-2 h-full">
                                    {/* 50% superior: Avatar y Username */}
                                    <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
                                        <img
                                            src={current.avatar}
                                            alt={current.name}
                                            draggable={false}
                                            className="w-40 h-40 rounded-full border-4 border-white object-cover select-none"
                                        />
                                        <h3 className="text-xl font-semibold text-white text-center">
                                            {current.name}
                                        </h3>
                                    </div>

                                    {/* 50% inferior: 4 cuadrantes */}
                                    <div className="grid grid-cols-2 grid-rows-2">
                                        {/* Cuadrante 1: Rank */}
                                        <div className="flex flex-col items-center justify-center p-4 border-r-2 border-b-2 border-white/20 bg-neutral-800/50">
                                            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
                                                Rank
                                            </span>
                                            <Badge variant="secondary" className="text-xl font-semibold">
                                                {current.tier && current.tier.includes(" ") ? current.tier.split(" ")[0] : current.tier || "Unranked"}
                                            </Badge>
                                        </div>

                                        {/* Cuadrante 2: Tier */}
                                        <div className="flex flex-col items-center justify-center p-4 border-b-2 border-white/20 bg-neutral-800/50">
                                            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
                                                Tier
                                            </span>
                                            <Badge variant="outline" className="text-xl font-semibold border-white/30 text-white">
                                                {current.tier && current.tier.includes(" ") ? current.tier.split(" ")[1] : current.tier || "N/A"}
                                            </Badge>
                                        </div>

                                        {/* Cuadrante 3: Honor */}
                                        <div className="flex flex-col items-center justify-center p-4 border-r-2 border-white/20 bg-neutral-800/50">
                                            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
                                                Honor
                                            </span>
                                            <Badge variant="secondary" className="text-xl font-semibold">
                                                {current.honor}
                                            </Badge>
                                        </div>

                                        {/* Cuadrante 4: Role */}
                                        <div className="flex flex-col items-center justify-center p-4 bg-neutral-800/50">
                                            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
                                                Role
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        IMG_ROLES[current.role]?.src ||
                                                        IMG_DEFAULT.profileIcon.src
                                                    }
                                                    alt={current.role}
                                                    draggable={false}
                                                    className="w-6 h-6 select-none"
                                                />
                                                <span className="text-sm font-semibold text-white text-xl">
                                                    {current.role.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Dialog para mostrar cuando hay un match */}
            <Dialog
                open={showMatchDialog}
                onOpenChange={(open) => {
                    //solo permitir cerrar desde los botones, no desde onOpenChange
                    if (!open) {
                        //no hacer nada, el cierre solo se permite desde los botones
                    }
                }}
            >
                <DialogContent
                    className="text-center"
                    showCloseButton={false}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {isAlreadyAdded ? "⚠️ Already Added" : "✅ Summoner Added!"}
                        </DialogTitle>
                        <DialogDescription className="text-lg mt-4">
                            {isAlreadyAdded
                                ? `${matchName} is already in your matches!`
                                : `${matchName} has been added to your matches!`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowMatchDialog(false)}
                        >
                            Keep Searching
                        </Button>
                        <Button
                            onClick={() => {
                                setShowMatchDialog(false);
                                setActiveTab("matches");
                            }}
                        >
                            View Matches
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
