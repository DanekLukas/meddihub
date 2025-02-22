import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }: any) => {

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1" contentInsetAdjustmentBehavior="automatic">
                <LinearGradient
                    colors={['#fee', '#ffe', '#eef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="min-h-full"
                >
                    {children}
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Layout;