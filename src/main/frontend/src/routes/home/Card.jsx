import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
// import { toggleFavorite } from "../../api/getData";
import styled from 'styled-components';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export default function PdtCard({ item, action, cateKey, tof, liked, onToggleLiked }) {

    const userSeq = useSelector((state) => state.user.userSeq);
    const [currentTime, setCurrentTime] = useState(new Date());

    // const [liked, setLiked] = React.useState(false);
    const handleFavorite = (ivt_seq) => {
        axios.post('/api/stock/toggle/favorite',
            {
                user_seq: userSeq,
                ivt_seq: ivt_seq,
            }
        ).then((response) => {
            console.log(response)
            console.log(cateKey)
            action(cateKey) //
        })
    } // 해당 재고의 즐겨찾기 토글

    const getRemainingTime = (expirationTime) => {

        const expTime = new Date(expirationTime).getTime();
        const remainingTime = expTime - currentTime.getTime();

        // 분으로 변환
        const minutes = Math.floor(remainingTime / (1000 * 60));

        return minutes;
    };

    return (
        <div className="favorite gap-2 grid grid-cols-2 sm:grid-cols-4">
            <Card
                key={item.id}
                isPressable
                onClick={() => console.log("item pressed")}
                isFooterBlurred={true}
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.45)',
                    boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)',
                }}
            >
                <CardBody
                    className="overflow-visible p-0">
                    {/* img 로컬과 합치기 */}
                    <Image
                        shadow="sm"
                        radius="lg"
                        width="100px"
                        height="100px"
                        alt={item.title}
                        className="w-full object-cover h-[140px]"
                        src={`/images/${item.sctg_seq}.png`}
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </CardBody>
                <CardFooter
                    className="text-small justify-between"
                >
                    <b>{item.name}</b>
                    <p className="text-default-500" style={{ color: "#336dc4", fontSize: '15px' }}>{item.count}개</p>
                    {!tof && (
                        <p>
                            {getRemainingTime(item.exp) <= 0
                                    ? '유통기한 : Expired!'
                                    : `유통기한 : +${Math.floor(getRemainingTime(item.exp) / (60 * 24))} Day`
                            }
                        </p>
                    )}
                    {tof && (
                        <Button
                            isIconOnly
                            className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                            radius="full"
                            variant="light"
                            onPress={() => {
                                onToggleLiked(item.id)
                                handleFavorite(item.ivt_seq)
                            }

                            }
                            style={{
                                position: 'relative',
                                border: 'none',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <HeartIcon
                                className={liked ? "[&>path]:stroke-transparent" : ""}
                                fill={liked ? "currentColor" : "none"}
                            />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}


