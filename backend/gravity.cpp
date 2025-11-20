#include <bits/stdc++.h>
using namespace std;

struct N { int x, y; bool operator==(const N &o) const { return x == o.x && y == o.y; } };
struct NH { size_t operator()(N const &p) const { return (uint64_t(uint32_t(p.x)) << 32) ^ uint32_t(p.y); } };

struct S { int x, y, id; bool operator==(const S &o) const { return x == o.x && y == o.y && id == o.id; } };
struct SH { size_t operator()(S const &k) const { uint64_t h = k.x; h = (h << 21) ^ k.y; h = (h << 21) ^ k.id; return size_t(h); } };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<long long> inp;
    long long val;
    while (cin >> val) inp.push_back(val);

    int i = 0;
    int n = (int)inp[i++];

    vector<array<int,4>> sl(n);
    for (int j = 0; j < n; j++) {
        sl[j][0] = (int)inp[i++];
        sl[j][1] = (int)inp[i++];
        sl[j][2] = (int)inp[i++];
        sl[j][3] = (int)inp[i++];
    }

    int sx = (int)inp[i++], sy = (int)inp[i++], e = (int)inp[i++];

    unordered_map<N, vector<int>, NH> zameen;   // ground map
    unordered_map<S, pair<int,int>, SH> agla;   // next jump positions

    for (int s = 0; s < n; s++) {
        int x1 = sl[s][0], y1 = sl[s][1], x2 = sl[s][2], y2 = sl[s][3];
        int dx = (x2 > x1) ? 1 : -1;
        int dy = (y2 > y1) ? 1 : -1;
        int len = abs(x2 - x1);

        if (dy == -1) {
            for (int k = 0; k < len; k++) {
                int x = x1 + dx * k;
                int y = y1 - k;
                zameen[{x,y}].push_back(s);
                agla[{x,y,s}] = {x + dx, y - 1};
            }
            zameen[{x2,y2}].push_back(s);
        } else {
            for (int k = 0; k < len; k++) {
                int x = x2 - dx * k;
                int y = y2 - k;
                zameen[{x,y}].push_back(s);
                agla[{x,y,s}] = {x - dx, y - 1};
            }
            zameen[{x1,y1}].push_back(s);
        }
    }

    auto girna = [&](int x, int y) -> pair<int,int> {
        for (int yy = y - 1; yy >= 0; yy--) {
            auto it = zameen.find({x, yy});
            if (it != zameen.end()) return {x, yy};
        }
        return {x, 0};
    };

    int x = sx, y = sy;
    if (zameen.find({x,y}) == zameen.end()) {
        auto p = girna(x, y);
        x = p.first; y = p.second;
    }

    while (true) {
        if (y == 0) break;

        auto it = zameen.find({x,y});
        if (it == zameen.end()) {
            auto p = girna(x, y);
            x = p.first; y = p.second;
            continue;
        }

        auto &ids = it->second;
        if (ids.size() == 1) {
            int s = ids[0];
            auto it2 = agla.find({x,y,s});
            if (it2 == agla.end()) {
                auto p = girna(x, y);
                x = p.first; y = p.second;
                continue;
            }
            if (e == 0) break;
            e--;
            x = it2->second.first;
            y = it2->second.second;
        } else {
            long long chk = 1LL * x * y;
            vector<pair<int,pair<int,int>>> neeche;
            neeche.reserve(ids.size());

            for (int s : ids) {
                auto it3 = agla.find({x,y,s});
                if (it3 != agla.end()) neeche.push_back({s, it3->second});
            }

            if ((long long)e <= chk) {
                if (neeche.empty()) {
                    auto p = girna(x, y);
                    x = p.first; y = p.second;
                    continue;
                }
                break;
            }
            e -= (int)chk;

            if (neeche.empty()) {
                auto p = girna(x, y);
                x = p.first; y = p.second;
                continue;
            }

            int bx = 0, by = -1;
            for (auto &qq : neeche) {
                int xx = qq.second.first;
                int yy = qq.second.second;
                if (yy > by) {
                    by = yy;
                    bx = xx;
                }
            }

            if (e == 0) break;
            e--;
            x = bx; y = by;
        }
    }

    cout << x << " " << y;
    return 0;
}
