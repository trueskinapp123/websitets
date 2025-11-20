from collections import deque

def milne_wale(arr):
    n = len(arr)
    for i in range(n):
        for j in range(i, n):
            tukra = arr[i:j+1]
            baqi = arr[:i] + arr[j+1:]
            for k in range(len(baqi) + 1):
                if k == i:
                    continue
                naya = baqi[:k] + tukra + baqi[k:]
                if naya != arr:
                    yield naya

n = int(input().strip())
input()
ulta = [input().rstrip('\n') for _ in range(n)]
input()
asli = [input().rstrip('\n') for _ in range(n)]

shuru = tuple(ulta)
manzil = tuple(asli)

if shuru == manzil:
    print(0, end='')
    exit()

aage = {shuru}
peechay = {manzil}
dekha_aage = {shuru: 0}
dekha_peechay = {manzil: 0}

while aage and peechay:
    if len(aage) > len(peechay):
        aage, peechay = peechay, aage
        dekha_aage, dekha_peechay = dekha_peechay, dekha_aage

    agla = set()
    for arr in aage:
        d = dekha_aage[arr]
        for naya in milne_wale(arr):
            if naya in dekha_aage:
                continue
            if naya in dekha_peechay:
                print(d + 1 + dekha_peechay[naya], end='')
                exit()
            dekha_aage[naya] = d + 1
            agla.add(naya)
    aage = agla

print(-1, end='')
