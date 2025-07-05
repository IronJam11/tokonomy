'use client';

import ProfilePage from "@/components/profileComponent";
import React from "react";
import { useAccount } from "wagmi";

export default function Profile () {
    const { address } = useAccount();

    return (
        <ProfilePage userAddress={address?.toString() ?? ""} />
    );
};

