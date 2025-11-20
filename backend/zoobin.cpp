#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<pair<int, int>> edges1(n), edges2(n);
    set<int> nodes;

    for (int i = 0; i < n; i++) {
        cin >> edges1[i].first >> edges1[i].second;
        nodes.insert(edges1[i].first);
        nodes.insert(edges1[i].second);
    }

    for (int i = 0; i < n; i++) 
        cin >> edges2[i].first >> edges2[i].second;

    vector<int> nodeList(nodes.begin(), nodes.end());

    auto normalize = [](vector<pair<int, int>> edges) {
        for (auto& [u, v] : edges)
            if (u > v) swap(u, v);
        sort(edges.begin(), edges.end());
        return edges;
    };

    auto encode = [](const vector<pair<int, int>>& edges) {
        string s;
        for (auto [u, v] : edges)
            s += to_string(u) + "-" + to_string(v) + ",";
        return s;
    };

    vector<pair<int, int>> target = normalize(edges2);
    string targetCode = encode(target);

    vector<pair<int, int>> start = normalize(edges1);
    string startCode = encode(start);

    if (startCode == targetCode) {
        cout << 0;
        return 0;
    }

    map<string, int> visited;
    queue<pair<vector<pair<int, int>>, int>> q;
    q.push({start, 0});
    visited[startCode] = 0;

    while (!q.empty()) {
        auto [curr, steps] = q.front();
        q.pop();

        map<int, vector<int>> graph;
        for (auto [u, v] : curr) {
            graph[u].push_back(v);
            graph[v].push_back(u);
        }

        set<vector<int>> cycles;

        for (int src : nodeList) {
            function<void(int, int, vector<int>&, set<int>&)> dfs = [&](int u, int parent, vector<int>& path, set<int>& seen) {
                path.push_back(u);
                seen.insert(u);

                for (int v : graph[u]) {
                    if (v == parent) continue;
                    if (seen.count(v)) {
                        auto it = find(path.begin(), path.end(), v);
                        if (it != path.end()) {
                            vector<int> cycle(it, path.end());
                            if (cycle.size() >= 3) {
                                int minIdx = min_element(cycle.begin(), cycle.end()) - cycle.begin();
                                rotate(cycle.begin(), cycle.begin() + minIdx, cycle.end());
                                cycles.insert(cycle);
                            }
                        }
                    } else if (path.size() < nodeList.size()) {
                        dfs(v, u, path, seen);
                    }
                }

                path.pop_back();
                seen.erase(u);
            };

            vector<int> path;
            set<int> seen;
            dfs(src, -1, path, seen);
        }

        for (const auto& cycle : cycles) {
            map<int, int> mapping;
            for (int node : nodeList) mapping[node] = node;

            int len = cycle.size();
            for (int i = 0; i < len; i++)
                mapping[cycle[i]] = cycle[(i + 1) % len];

            vector<pair<int, int>> next;
            for (auto [u, v] : curr)
                next.push_back({mapping[u], mapping[v]});

            next = normalize(next);
            string code = encode(next);

            if (code == targetCode) {
                cout << steps + 1;
                return 0;
            }

            if (!visited.count(code)) {
                visited[code] = steps + 1;
                q.push({next, steps + 1});
            }
        }
    }

    cout << -1;
    return 0;
}
