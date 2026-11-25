import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';

interface Msg {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

export function AiChatFab() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Msg[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'Oi! Sou a SukiBot. Posso te ajudar a escolher um doce ou tirar dúvidas sobre pedidos?',
        },
    ]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { id: String(Date.now()), sender: 'user', text }]);
        setInput('');
        // Conecte aqui com sua rota de IA do backend (equivalente ao gemini.service.ts do Angular)
    };

    return (
        <>
            <Pressable style={styles.fab} onPress={() => setOpen(true)}>
                <Icon name="aiSparkle" size={24} color={colors.white} />
            </Pressable>

            <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
                <KeyboardAvoidingView
                    style={styles.modal}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTitleRow}>
                            <Icon name="sukiBot" size={26} color={colors.brownDark} />
                            <Text style={styles.modalTitle}>SukiBot</Text>
                        </View>
                        <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                            <Icon name="close" size={24} color={colors.brownDark} />
                        </Pressable>
                    </View>

                    <FlatList
                        data={messages}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={{ padding: 16, gap: 10 }}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.bubble,
                                    item.sender === 'user' ? styles.userBubble : styles.botBubble,
                                ]}
                            >
                                <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
                                    {item.text}
                                </Text>
                            </View>
                        )}
                    />

                    <View style={styles.inputRow}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Digite sua dúvida..."
                            placeholderTextColor={colors.muted}
                            style={styles.input}
                        />
                        <Pressable style={styles.sendBtn} onPress={sendMessage}>
                            <Icon name="send" size={18} color={colors.white} />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 18,
        bottom: 96,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.pink,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: colors.pink,
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    modal: { flex: 1, backgroundColor: colors.pinkSurface },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderPink,
    },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    modalTitle: { fontSize: 17, fontWeight: '800', color: colors.brownDark },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
    userBubble: { alignSelf: 'flex-end', backgroundColor: colors.pink },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    userText: { color: colors.white, fontSize: 14 },
    botText: { color: colors.brownDark, fontSize: 14 },
    inputRow: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        paddingBottom: 24,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.borderPink,
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: colors.pinkSurface,
        borderRadius: 22,
        paddingHorizontal: 16,
        color: colors.brownDark,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.pink,
        alignItems: 'center',
        justifyContent: 'center',
    },
});